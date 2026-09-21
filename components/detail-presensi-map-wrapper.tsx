"use client";

import dynamic from "next/dynamic";

const PresensiMap = dynamic(
    () => import("@/components/detail-presensiMap"),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-64 w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
                <p className="text-sm text-gray-500">
                    Memuat peta...
                </p>
            </div>
        ),
    }
);

interface DetailPresensiMapWrapperProps {
    latitude: number;
    longitude: number;
    title: string;
}

export default function DetailPresensiMapWrapper({
    latitude,
    longitude,
    title,
}: DetailPresensiMapWrapperProps) {
    return (
        <PresensiMap
            latitude={latitude}
            longitude={longitude}
            title={title}
        />
    );
}