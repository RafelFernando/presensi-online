import { prisma } from "@/lib/prisma";
import PresensiButtons from "@/components/presensi-button";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { FaIdCard } from "react-icons/fa";
import Clock from "@/components/clock";
import Navbar from "@/components/navbar/navbar";

export default async function PresensiPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const presensi = await prisma.presensi.findFirst({
    where: {
      userId: session.user.id,
      tanggal: { gte: startOfDay, lte: endOfDay },
    },
    orderBy: { tanggal: "desc" },
  });

  const sudahCheckIn = !!presensi?.jam_masuk;
  const sudahCheckOut = !!presensi?.jam_keluar;

  // Status terpadu
  const status = !sudahCheckIn
    ? {
        label: "Belum Presensi Masuk",
        color: "text-orange-600",
        dot: "bg-orange-500",
        bg: "bg-orange-50",
        border: "border-orange-200",
      }
    : !sudahCheckOut
    ? {
        label: "Sudah Presensi Masuk",
        color: "text-blue-600",
        dot: "bg-blue-500",
        bg: "bg-blue-50",
        border: "border-blue-200",
      }
    : {
        label: "Sudah Presensi Pulang",
        color: "text-green-600",
        dot: "bg-green-500",
        bg: "bg-green-50",
        border: "border-green-200",
      };

  const tanggalHariIni = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24 pb-10 px-4">
        <div className="mx-auto w-full max-w-md space-y-4">
          {/* ===== Kartu Profil ===== */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-4 p-5">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-100 ring-2 ring-white shadow">
                <Image
                  src={session.user.image || "/avatar.svg"}
                  alt="avatar"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-bold text-gray-900">
                  {session.user.name}
                </h1>
                <div className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
                  <FaIdCard className="shrink-0" />
                  <span>99999999999</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Waktu Saat Ini
              </p>
              <div className="mt-1">
                <Clock />
              </div>
            </div>
          </div>

          {/* ===== Kartu Status ===== */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Status Presensi
                </p>
                <p className="text-xs text-gray-500">{tanggalHariIni}</p>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full ${status.bg} px-3 py-1 text-xs font-medium ${status.color} ${status.border} border`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>

            {/* Ringkasan jam */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                  Jam Masuk
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {presensi?.jam_masuk
                    ? new Date(presensi.jam_masuk).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                  Jam Keluar
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {presensi?.jam_keluar
                    ? new Date(presensi.jam_keluar).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* ===== Tombol Presensi ===== */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <PresensiButtons
              sudahCheckIn={sudahCheckIn}
              sudahCheckOut={sudahCheckOut}
            />
          </div>
        </div>
      </main>
    </>
  );
}