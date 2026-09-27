import { getPresensiByUserId } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import clsx from "clsx";

export default async function PresensiTable() {
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

    const presensi = await getPresensiByUserId();

    // Ambil tanggal hari ini
    const today = new Date();

    // Awal bulan
    const startOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    // Akhir bulan
    const endOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    );

    // Buat semua tanggal dalam bulan berjalan
    const dates = [];

    for (
        let date = new Date(startOfMonth);
        date <= endOfMonth;
        date.setDate(date.getDate() + 1)
    ) {
        dates.push(new Date(date));
    }

    // Buat data tabel
    const tableData: TableData[] = dates.flatMap((date) => {
        // 0 = Minggu
        // 6 = Sabtu
        const day = date.getDay();

        const isWeekend = day === 0 || day === 6;

        // Cari presensi pada tanggal tersebut
        const attendance = presensi?.find((item) => {
            const attendanceDate = new Date(item.tanggal);

            return (
                attendanceDate.getFullYear() === date.getFullYear() &&
                attendanceDate.getMonth() === date.getMonth() &&
                attendanceDate.getDate() === date.getDate()
            );
        });

        // Sabtu / Minggu
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
                    status: "Hari Libur",
                },
            ];
        }

        // Senin - Jumat tetapi tidak ada presensi
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
                    status: "Tidak Hadir",
                },
            ];
        }

        // Kalau ada presensi
        const data: TableData[] = [];

        // Presensi masuk
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

        // Presensi keluar
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

    return (
        <div className="bg-white p-3 sm:p-4 mt-5 shadow-sm rounded-lg">
            <div className="w-full overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                                Tanggal
                            </th>

                            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                                Waktu
                            </th>

                            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                                Type
                            </th>

                            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                                Foto
                            </th>

                            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                                Lokasi
                            </th>

                            <th className="px-6 py-3 w-40 text-sm font-bold text-gray-700 uppercase text-left">
                                Metode Presensi
                            </th>

                            <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {tableData.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-gray-100 transition-colors"
                            >
                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                                    {formatDate(item.tanggal.toString())}
                                </td>

                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                                    {item.jam
                                        ? new Date(item.jam).toLocaleTimeString(
                                            "id-ID",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )
                                        : "-"}
                                </td>

                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                                    {item.jenis}
                                </td>

                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                                    {item.foto ? (
                                        <div className="relative w-20 h-14 sm:w-24 sm:h-16 md:w-32 md:h-20">
                                            <Image
                                                src={item.foto}
                                                fill
                                                sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 128px"
                                                alt="foto presensi"
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500">
                                            -
                                        </span>
                                    )}
                                </td>

                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                                    SPPG Laweyan Laweyan
                                </td>

                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                                    {item.status === "Hadir"
                                        ? "Presensi Online"
                                        : "-"}
                                </td>

                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                                    <span
                                        className={clsx(
                                            "inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium",
                                            {
                                                "bg-green-100 text-green-700":
                                                    item.status === "Hadir",

                                                "bg-red-100 text-red-700":
                                                    item.status === "Tidak Hadir",

                                                "bg-gray-100 text-gray-600":
                                                    item.status === "Hari Libur",
                                            }
                                        )}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}