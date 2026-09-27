import DetailPresensi from "@/components/detail/detailpage";
import Navbar from "@/components/navbar/navbar";
import { Suspense } from "react";

export default function PresensiKeluar() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-100 p-5 mt-20">
                <Suspense fallback={<>memuat data.....</>}>
                    <DetailPresensi />
                </Suspense>
            </main>
        </>
    );
}