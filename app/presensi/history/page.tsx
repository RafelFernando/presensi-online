import PresensiTable from "@/components/riwayat-presensi/table";
import Navbar from "@/components/navbar/navbar";
import { Suspense } from "react";
import Link from "next/link";

type SearchParams = Promise<{ month?: string; year?: string }>;

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const now = new Date();
  const month = params.month ? Number(params.month) : now.getMonth(); // 0-11
  const year = params.year ? Number(params.year) : now.getFullYear();

  // Validasi
  const safeMonth = Number.isInteger(month) && month >= 0 && month <= 11 ? month : now.getMonth();
  const safeYear = Number.isInteger(year) && year >= 2000 && year <= 2100 ? year : now.getFullYear();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
        <div className="mx-auto w-full max-w-6xl">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Riwayat Presensi
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Rekap kehadiran bulanan Anda
              </p>
            </div>

            <Link
              href="/presensi"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Kembali
            </Link>
          </div>

          <Suspense fallback={<p className="mt-6 text-sm text-gray-500">Loading data...</p>}>
            <PresensiTable month={safeMonth} year={safeYear} />
          </Suspense>
        </div>
      </main>
    </>
  );
}