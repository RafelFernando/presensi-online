"use client";

import { useEffect, useState } from "react";

export default function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col justify-center text-center p-3">
            {/* Hari dan tanggal */}
            <p className="font-semibold text-base">
                {time.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })}
            </p>

            {/* Jam */}
            <p className="font-bold text-2xl">
                {time.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })}
            </p>
        </div>
    );
}