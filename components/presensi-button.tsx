"use client";

import Link from "next/link";
import { useState } from "react";
import GpsStatus from "@/components/cek-gps-status";

interface PresensiButtonsProps {
    sudahCheckIn: boolean;
    sudahCheckOut: boolean;
}

export default function PresensiButtons({
    sudahCheckIn,
    sudahCheckOut,
}: PresensiButtonsProps) {
    const [gpsAktif, setGpsAktif] = useState(false);

    return (
        <>
            {/* STATUS GPS */}
            <GpsStatus
                onStatusChange={(active) => {
                    setGpsAktif(active);
                }}
            />

            {/* BUTTON */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* CHECK IN */}
                {sudahCheckIn ? (
                    <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-xl bg-gray-300 px-5 py-3 font-semibold text-gray-500"
                    >
                        Masuk
                    </button>
                ) : !gpsAktif ? (
                    <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-xl bg-gray-300 px-5 py-3 font-semibold text-gray-500"
                    >
                        Aktifkan GPS
                    </button>
                ) : (
                    <Link
                        href="/presensi/masuk"
                        className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                    >
                        Masuk
                    </Link>
                )}

                {/* CHECK OUT */}
                {!sudahCheckIn ? (
                    <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-xl bg-gray-300 px-5 py-3 font-semibold text-gray-500"
                    >
                        Pulang
                    </button>
                ) : sudahCheckOut ? (
                    <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-xl bg-gray-300 px-5 py-3 font-semibold text-gray-500"
                    >
                        Pulang
                    </button>
                ) : !gpsAktif ? (
                    <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-xl bg-gray-300 px-5 py-3 font-semibold text-gray-500"
                    >
                        Aktifkan GPS
                    </button>
                ) : (
                    <Link
                        href="/presensi/keluar"
                        className="rounded-xl bg-green-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-green-700"
                    >
                        Pulang
                    </Link>
                )}

                {/* DETAIL */}
                <Link
                    href="/presensi/detail"
                    className="mt-4 block w-full rounded-xl border border-gray-300 bg-white px-5 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50 sm:col-span-2"
                >
                    Lihat Detail Presensi
                </Link>

                <Link
                    href="/presensi/history"
                    className="block w-full rounded-xl border border-gray-300 bg-white px-5 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50 sm:col-span-2"
                >
                    Lihat Riwayat Presensi
                </Link>
            </div>
        </>
    );
}