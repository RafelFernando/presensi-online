import Link from "next/link"
import PresensiTable from "@/components/riwayat-presensi/table"
import { Suspense } from "react"

export default function HistoryPage() {
    return (
        <div className="w-full px-4 mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-gray-800">History Presensi</h1>
            </div>
            <Suspense fallback={<p>Loading Data...</p>}>
                <PresensiTable />
            </Suspense>
        </div>
    )
}