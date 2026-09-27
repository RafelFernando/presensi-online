import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DetailPresensiMapWrapper from "@/components/detail-presensi-map-wrapper";

export default async function DetailPresensi() {
    const now = new Date();

    // Awal hari
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // Akhir hari
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const presensi = await prisma.presensi.findFirst({
        where: {
            tanggal: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        orderBy: {
            tanggal: "desc",
        },
    });

    // Belum ada presensi
    if (!presensi) {
        return (
            <main className="min-h-screen bg-gray-100 p-5">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Detail Presensi
                        </h1>

                        <div className="mt-6 rounded-xl bg-gray-50 p-6 text-center">
                            <p className="text-gray-500">
                                Belum ada data presensi hari ini.
                            </p>

                            <Link
                                href="/presensi"
                                className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                            >
                                Kembali
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const sudahCheckIn = !!presensi.jam_masuk;
    const sudahCheckOut = !!presensi.jam_keluar;

    const formatTanggal = (date: Date) => {
        return new Intl.DateTimeFormat("id-ID", {
            dateStyle: "full",
        }).format(date);
    };

    const formatJam = (date: Date | null) => {
        if (!date) return "-";

        return new Intl.DateTimeFormat("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(date);
    };

    return (
        <main className="min-h-screen bg-gray-100">
            <div className="mx-auto">
                {/* HEADER */}
                <div className="mb-5">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Detail Presensi
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Data presensi hari ini
                    </p>
                </div>

                {/* TANGGAL & STATUS */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Tanggal
                            </p>

                            <p className="mt-1 font-semibold text-gray-900">
                                {formatTanggal(
                                    presensi.tanggal
                                )}
                            </p>
                        </div>

                        <div>
                            {!sudahCheckIn && (
                                <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                                    Belum Presensi Masuk
                                </span>
                            )}

                            {sudahCheckIn &&
                                !sudahCheckOut && (
                                    <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
                                        Sudah Presensi Masuk
                                    </span>
                                )}

                            {sudahCheckIn &&
                                sudahCheckOut && (
                                    <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-600">
                                        Presensi Selesai
                                    </span>
                                )}
                        </div>
                    </div>
                </div>

                {/* CHECK IN & CHECK OUT */}
                <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {/* CHECK IN */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-bold text-blue-600">
                            Masuk
                        </h2>

                        <div className="mt-4 space-y-4">
                            {/* FOTO */}
                            <div>
                                <p className="mb-2 text-sm font-medium text-gray-500">
                                    Foto
                                </p>

                                {presensi.foto_masuk ? (
                                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
                                        <Image
                                            src={
                                                presensi.foto_masuk
                                            }
                                            alt="Foto Check In"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100">
                                        <p className="text-sm text-gray-400">
                                            Foto belum tersedia
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* JAM */}
                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">
                                    Jam Masuk
                                </p>

                                <p className="mt-1 text-xl font-bold text-gray-900">
                                    {formatJam(
                                        presensi.jam_masuk
                                    )}
                                </p>
                            </div>

                            {/* LOKASI */}
                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">
                                    Lokasi Masuk
                                </p>

                                {presensi.checkInLatitude !== null &&
                                    presensi.checkInLongitude !== null ? (
                                    <div className="mt-3 space-y-3">
                                        <DetailPresensiMapWrapper
                                            latitude={presensi.checkInLatitude}
                                            longitude={presensi.checkInLongitude}
                                            title="Lokasi Check In"
                                        />

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Latitude
                                                </p>

                                                <p className="break-all font-medium text-gray-900">
                                                    {presensi.checkInLatitude.toFixed(6)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Longitude
                                                </p>

                                                <p className="break-all font-medium text-gray-900">
                                                    {presensi.checkInLongitude.toFixed(6)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-1 text-sm text-gray-400">
                                        Lokasi belum tersedia
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CHECK OUT */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-bold text-green-600">
                            Pulang
                        </h2>

                        <div className="mt-4 space-y-4">
                            {/* FOTO */}
                            <div>
                                <p className="mb-2 text-sm font-medium text-gray-500">
                                    Foto
                                </p>

                                {presensi.foto_keluar ? (
                                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
                                        <Image
                                            src={
                                                presensi.foto_keluar
                                            }
                                            alt="Foto Check Out"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100">
                                        <p className="text-sm text-gray-400">
                                            Belum melakukan Presensi Pulang
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* JAM */}
                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">
                                    Jam Pulang
                                </p>

                                <p className="mt-1 text-xl font-bold text-gray-900">
                                    {formatJam(
                                        presensi.jam_keluar
                                    )}
                                </p>
                            </div>

                            {/* LOKASI */}
                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">
                                    Lokasi Keluar
                                </p>

                                {presensi.checkOutLatitude !== null &&
                                    presensi.checkOutLongitude !== null ? (
                                    <div className="mt-3 space-y-3">
                                        <DetailPresensiMapWrapper
                                            latitude={presensi.checkOutLatitude}
                                            longitude={presensi.checkOutLongitude}
                                            title="Lokasi Check Out"
                                        />

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Latitude
                                                </p>

                                                <p className="break-all font-medium text-gray-900">
                                                    {presensi.checkOutLatitude.toFixed(6)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Longitude
                                                </p>

                                                <p className="break-all font-medium text-gray-900">
                                                    {presensi.checkOutLongitude.toFixed(6)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-1 text-sm text-gray-400">
                                        Lokasi belum tersedia
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* BUTTON */}
                <div className="mt-5">
                    <Link
                        href="/presensi"
                        className="block w-full rounded-sm bg-blue-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-gray-900"
                    >
                        Kembali
                    </Link>
                </div>
            </div>
        </main>
    );
}