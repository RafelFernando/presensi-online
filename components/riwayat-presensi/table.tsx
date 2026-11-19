import { getPresensiByUserId } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import clsx from "clsx";
import FilterBulan from "./filter-bulan";

type TableData = {
  id: string;
  tanggal: Date;
  jenis: string;
  jam: Date | null;
  foto: string | null;
  latitude: number | null;
  longitude: number | null;
  catatan: string | null;
  status: "Hadir" | "Tidak Hadir" | "Hari Libur";
};

export default async function PresensiTable({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const presensi = await getPresensiByUserId({ month, year });

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  // Buat semua tanggal dalam bulan yang dipilih
  const dates: Date[] = [];
  for (
    let d = new Date(startOfMonth);
    d <= endOfMonth;
    d.setDate(d.getDate() + 1)
  ) {
    dates.push(new Date(d));
  }

  const tableData: TableData[] = dates.flatMap((date) => {
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;

    const attendance = presensi?.find((item) => {
      const attendanceDate = new Date(item.tanggal);
      return (
        attendanceDate.getFullYear() === date.getFullYear() &&
        attendanceDate.getMonth() === date.getMonth() &&
        attendanceDate.getDate() === date.getDate()
      );
    });

    if (isWeekend) {
      return [
        {
          id: `libur-${date.toISOString()}`,
          tanggal: date,
          jenis: "-",
          jam: null,
          foto: null,
          latitude: null,
          longitude: null,
          catatan: null,
          status: "Hari Libur" as const,
        },
      ];
    }

    if (!attendance) {
      return [
        {
          id: `tidak-hadir-${date.toISOString()}`,
          tanggal: date,
          jenis: "-",
          jam: null,
          foto: null,
          latitude: null,
          longitude: null,
          catatan: null,
          status: "Tidak Hadir" as const,
        },
      ];
    }

    const data: TableData[] = [];

    if (attendance.jam_masuk) {
      data.push({
        id: `${attendance.id}-masuk`,
        tanggal: date,
        jenis: "Masuk",
        jam: attendance.jam_masuk,
        foto: attendance.foto_masuk,
        latitude: attendance.checkInLatitude,
        longitude: attendance.checkInLongitude,
        catatan: attendance.catatan_masuk,
        status: "Hadir",
      });
    }

    if (attendance.jam_keluar) {
      data.push({
        id: `${attendance.id}-keluar`,
        tanggal: date,
        jenis: "Keluar",
        jam: attendance.jam_keluar,
        foto: attendance.foto_keluar,
        latitude: attendance.checkOutLatitude,
        longitude: attendance.checkOutLongitude,
        catatan: attendance.catatan_keluar,
        status: "Hadir",
      });
    }

    return data;
  });

  // ===== Hitung total per HARI (bukan per baris) =====
  const hariKerja = dates.filter((d) => d.getDay() !== 0 && d.getDay() !== 6).length;

  const hariHadir = new Set(
    tableData
      .filter((item) => item.status === "Hadir")
      .map((item) => new Date(item.tanggal).toDateString())
  ).size;

  const hariTidakHadir = hariKerja - hariHadir;

  return (
    <>
      {/* ===== Filter Bulan ===== */}
      <FilterBulan month={month} year={year} />

      {/* ===== Summary Cards ===== */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Hari Kerja
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{hariKerja}</p>
          <p className="text-xs text-gray-500">Senin – Jumat</p>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-green-600">
            Hadir
          </p>
          <p className="mt-1 text-2xl font-bold text-green-700">{hariHadir}</p>
          <p className="text-xs text-green-600">
            {hariKerja > 0
              ? `${Math.round((hariHadir / hariKerja) * 100)}% kehadiran`
              : "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-red-600">
            Tidak Hadir
          </p>
          <p className="mt-1 text-2xl font-bold text-red-700">{hariTidakHadir}</p>
          <p className="text-xs text-red-600">Hari kerja tanpa presensi</p>
        </div>
      </div>

      {/* ===== Tabel ===== */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Waktu
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Tipe
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Foto
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Lokasi
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Metode
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                    Tidak ada data pada bulan ini.
                  </td>
                </tr>
              ) : (
                tableData.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDate(item.tanggal.toString())}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {item.jam
                        ? new Date(item.jam).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{item.jenis}</td>
                    <td className="px-4 py-3">
                      {item.foto ? (
                        <div className="relative h-14 w-20 overflow-hidden rounded-md sm:h-16 sm:w-24">
                          <Image
                            src={item.foto}
                            fill
                            sizes="(max-width: 640px) 80px, 96px"
                            alt="foto presensi"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {item.latitude && item.longitude ? "SPPG Laweyan" : "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {item.status === "Hadir" ? "Presensi Online" : "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={clsx(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                          {
                            "bg-green-100 text-green-700": item.status === "Hadir",
                            "bg-red-100 text-red-700": item.status === "Tidak Hadir",
                            "bg-gray-100 text-gray-600": item.status === "Hari Libur",
                          }
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}