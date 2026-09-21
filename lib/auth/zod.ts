import { object, string } from "zod";

export const SignInSchema = object({
    email: string().email("Email tidak valid"),
    password: string()
        .min(8, "Password minimal 8 karakter")
        .max(32, "Password maksimal 32 karakter"),
    recaptchaToken: string()
        .min(1, "reCAPTCHA tidak valid"),
})

export const RegisterSchema = object({
    name: string().min(3, "Name harus minimal 3 karakter"),
    email: string().email("Email tidak valid"),
    password: string()
        .min(8, "Password minimal 8 karakter")
        .max(32, "Password maksimal 32 karakter"),
    confirmPassword: string()
        .min(8, "Konfirmasi password minimal 8 karakter")
        .max(32, "Konfirmasi password maksimal 32 karakter"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak cocok",
    path: ["confirmPassword"],
})