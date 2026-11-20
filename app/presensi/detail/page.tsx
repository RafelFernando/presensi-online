import DetailPresensi from "@/components/detail/detailpage";
import NavbarLayout from "@/components/navbar/navbar-layout";
import { Suspense } from "react";

export default function PresensiKeluar() {
    return (
        <>
            <NavbarLayout />
            <main className="min-h-screen bg-gray-100 p-5 mt-5">
                <Suspense fallback={<>memuat data.....</>}>
                    <DetailPresensi />
                </Suspense>
            </main>
        </>
    );
}