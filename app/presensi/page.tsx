import { prisma } from "@/lib/prisma";
import PresensiButtons from "@/components/presensi-button";
import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation";
import Image from "next/image";
import { FaIdCard } from 'react-icons/fa';
import Clock from "@/components/clock";

export default async function PresensiPage() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) redirect("/login");
    const now = new Date();

    // Awal hari
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // Akhir hari
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Ambil presensi hari ini
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

    const sudahCheckIn = !!presensi?.jam_masuk;
    const sudahCheckOut = !!presensi?.jam_keluar;

    return (
        <main className="min-h-screen bg-gray-100 p-5">
            <div className="mx-auto max-w-md">
                <div className="rounded-sm bg-white p-6 shadow-sm">
                    <div className="border border-black p-3 rounded-sm bg-slate-50">
                        <div className="flex items-center gap-3 justify-star md:order-2">
                            <div className="hidden text-sm bg-gray-50 border rounded-full md:me-0 md:block focus:ring-4 focus:ring-gray-300">
                                <Image src={session.user.image || "/avatar.svg"} width={64} height={64} alt="avatar" className="size-8 rounded-full" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold text-black">Halo {session.user.name}</h1>
                                <div className="flex items-center gap-1">
                                    <FaIdCard />
                                    <p className="text-sm text-gray-500">99999999999</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-col justify-center text-center p-3">
                        <p className="font-medium text-sm">Waktu saat ini</p>
                        <Clock />
                    </div>

                    {/* STATUS */}
                    <div className="mt-2 rounded-xl bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            Status Presensi Hari Ini
                        </p>

                        {!sudahCheckIn && (
                            <p className="mt-1 font-semibold text-orange-600">
                                Belum Presensi Masuk
                            </p>
                        )}

                        {sudahCheckIn && !sudahCheckOut && (
                            <p className="mt-1 font-semibold text-blue-600">
                                Sudah Presensi Masuk
                            </p>
                        )}

                        {sudahCheckIn && sudahCheckOut && (
                            <p className="mt-1 font-semibold text-green-600">
                                Sudah Presensi Pulang
                            </p>
                        )}
                    </div>

                    <PresensiButtons
                        sudahCheckIn={sudahCheckIn}
                        sudahCheckOut={sudahCheckOut}
                    />
                </div>
            </div>
        </main>
    );
}