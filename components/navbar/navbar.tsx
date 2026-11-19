import Link from "next/link";
import Image from "next/image";
import Navlink from "@/components/navbar/navlink";
import {auth} from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function Navbar() {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }
    return (
        <div className="fixed top-0 w-full bg-white shadow-sm z-20">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
                <Link href="/">
                    <Image src="/bgn-logo.png" alt="Logo" width={50} height={50} priority />
                </Link>
                <Navlink />
            </div>
        </div>
    )
}