"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function FilterBulan({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const go = (m: number, y: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(m));
    params.set("year", String(y));
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handlePrev = () => {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    go(m, y);
  };

  const handleNext = () => {
    const now = new Date();
    // Cegah navigasi ke bulan depan (masa depan)
    if (year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth())) {
      return;
    }
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    go(m, y);
  };

  return (
    <div className="mt-6 flex items-center gap-2">
      <button
        type="button"
        onClick={handlePrev}
        disabled={isPending}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
      >
        ← Sebelumnya
      </button>

      <span className="min-w-[140px] rounded-lg bg-white px-4 py-2 text-center text-sm font-semibold text-gray-900 border border-gray-300">
        {MONTHS[month]} {year}
      </span>

      <button
        type="button"
        onClick={handleNext}
        disabled={isPending}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
      >
        Berikutnya →
      </button>
    </div>
  );
}