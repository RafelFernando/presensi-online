"use client";

import { useEffect, useState } from "react";

type GpsStatus = "checking" | "active" | "inactive";

interface GpsStatusProps {
    onStatusChange: (active: boolean) => void;
}

export default function GpsStatus({
    onStatusChange,
}: GpsStatusProps) {
    const [status, setStatus] =
        useState<GpsStatus>("checking");

    const checkGps = () => {
        if (!navigator.geolocation) {
            setStatus("inactive");
            onStatusChange(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            () => {
                setStatus("active");
                onStatusChange(true);
            },
            () => {
                setStatus("inactive");
                onStatusChange(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    useEffect(() => {
        checkGps();
    }, []);

    const handleActivateGps = () => {
        setStatus("checking");
        checkGps();
    };

    if (status === "checking") {
        return (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                    <div className="size-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />

                    <div>
                        <p className="font-semibold text-gray-700">
                            Mengecek GPS...
                        </p>

                        <p className="text-sm text-gray-500">
                            Mohon tunggu sebentar.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === "active") {
        return (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="font-semibold text-green-700">
                            GPS Sudah Aktif
                        </p>

                        <p className="mt-1 text-sm text-green-600">
                            Lokasi Anda dapat digunakan untuk presensi.
                        </p>
                    </div>

                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
                        ✓
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex flex-col gap-3">
                <div>
                    <p className="font-semibold text-orange-700">
                        GPS tidak aktif
                    </p>

                    <p className="mt-1 text-sm text-orange-600">
                        Aplikasi presensi online memerlukan izin akses lokasi untuk verifikasi kehadiran anda
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleActivateGps}
                    className="w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                    Aktifkan GPS
                </button>
            </div>
        </div>
    );
}