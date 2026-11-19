import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth/auth";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    return (
        <div className="bg-gray-100 h-full">
            <div className="flex flex-col items-center justify-between px-6 py-8 mx-auto h-full">
                <div className="w-full rounded-lg mt-0 max-w-md">
                    <SessionProvider session={session}>
          {children}
        </SessionProvider>
                </div>
            </div>
        </div>
    )
}