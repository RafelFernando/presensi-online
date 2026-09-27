import PresensiTable from "@/components/riwayat-presensi/table"
import Navbar from "@/components/navbar/navbar"
import { Suspense } from "react"
import Link from "next/link"

export default function HistoryPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-100 p-5 mt-20">
                <div className="w-full px-2 mx-auto">
                    <div className="flex items-start justify-between flex-col md:flex-row md:items-center">
                        <h1 className="text-4xl font-bold text-gray-800">History Presensi</h1>
                        <Link
                            href="/presensi"
                            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                        >
                            Kembali
                        </Link>
                    </div>
                    <Suspense fallback={<p>Loading Data...</p>}>
                        <PresensiTable />
                    </Suspense>
                </div>
            </main>
        </>
    )
}