import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import { SignInSchema } from "@/lib/auth/zod"
import { compareSync } from "bcrypt-ts"
import { Adapter } from "next-auth/adapters"
import { verifyRecaptcha } from "@/lib/auth/recaptcha";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 1, // 1 hari
    },
    jwt: {
        maxAge: 60 * 60 * 24 * 1,
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
                recaptchaToken: {},
            },
            authorize: async (credentials) => {
                const validatedFields = SignInSchema.safeParse(credentials);

                if (!validatedFields.success) return null;

                const { email, password, recaptchaToken } = validatedFields.data;

                // Verifikasi Google reCAPTCHA
                const recaptcha = await verifyRecaptcha(recaptchaToken);

                if (!recaptcha.success) {
                    throw new Error("Verifikasi reCAPTCHA gagal");
                }

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.password) {
                    throw new Error("User tidak ditemukan");
                }

                const passwordMatch = compareSync(password, user.password);
                if (!passwordMatch) {
                    throw new Error(
                        "Password salah"
                    )
                }

                return user;
            },
        })
    ],

    // callback
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const ProtectedRoutes = ["/dashboard"];

            if (!isLoggedIn && ProtectedRoutes.includes(nextUrl.pathname)) {
                return Response.redirect(new URL("/login", nextUrl));
            }

            if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            return true;
        },
        session({ session, token }) {
            session.user.id = token.sub;
            session.user.role = token.role;
            return session;
        },
        jwt({ token, user }) {
            if (user) token.role = user.role;
            return token;
        }
    }
})