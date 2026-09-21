import FormLogin from "@/components/auth/form-login";
import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import Image from "next/image";

export default async function Login({ searchParams }: {
    searchParams?: Promise<{ error?: string }>
}) {
    const session = await auth()
    if (session) {
        redirect("/dashboard")
    }

    const params = (await searchParams)?.error

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div>
                    <Image
                        src="/bgn-logo.png"
                        alt="Logo"
                        width={200}
                        height={200}
                        className="p-5"
                    />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-center text-black">Selamat Datang Kembali</h1>
                    <p className="text-center text-gray-500 font-medium text-lg">Masuk ke BGN Head Office Support System</p>
                </div>
                <div className="p-6 space-y-4">
                    {params === "OAuthAccountNotLinked" && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100" role="alert">
                            <span className="font-medium">Account already use by other provider</span>
                        </div>
                    )}
                    <div className="px-6 py-8 w-full rounded-lg mt-0 max-w-md bg-white">
                        <FormLogin />
                    </div>
                </div>
            </div>
        </>
    )
}