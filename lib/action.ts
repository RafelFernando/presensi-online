"use server";

import { checkInSchema, checkOutSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth/auth";

export const Masuk = async (
    images: string,
    prevState: unknown,
    formData: FormData
) => {
    // cek session user
    const session = await auth();
    if (!session || !session.user || !session.user.id) redirect(`/login`);

    const now = new Date();
    const rawData = {
        checkInLatitude: formData.get("checkInLatitude"),
        checkInLongitude: formData.get("checkInLongitude"),
        catatan_masuk: formData.get("catatan_masuk") || undefined
    };

    const validatedFields = checkInSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const {
        checkInLatitude,
        checkInLongitude,
        catatan_masuk
    } = validatedFields.data;

    try {
        const dataMasuk = await prisma.presensi.create({
            data: {
                userId: session.user.id as string,
                foto_masuk: images,
                checkInLatitude,
                checkInLongitude,
                jam_masuk: now,
                catatan_masuk
            },
        });
    } catch (error) {
        console.error("CREATE PRODUCT ERROR:", error);

        return {
            message: "Gagal masuk, silahkan coba lagi",
        };
    }

    revalidatePath("/presensi");
    redirect("/presensi");
};

export const Keluar = async (
    images: string,
    prevState: unknown,
    formData: FormData
) => {
    const rawData = {
        checkOutLatitude: formData.get("checkOutLatitude"),
        checkOutLongitude: formData.get("checkOutLongitude"),
        catatan_keluar: formData.get("catatan_masuk") || undefined
    };

    console.log("RAW CHECK OUT DATA:", rawData);

    const validatedFields =
        checkOutSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.log(
            "CHECK OUT VALIDATION ERROR:",
            validatedFields.error.flatten()
                .fieldErrors
        );

        return {
            errors:
                validatedFields.error.flatten()
                    .fieldErrors,
        };
    }

    const {
        checkOutLatitude,
        checkOutLongitude,
    } = validatedFields.data;

    try {
        const now = new Date();

        // Awal hari
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        // Akhir hari
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        // Cari presensi hari ini
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

        // Belum melakukan Check In
        if (!presensi) {
            return {
                message:
                    "Anda belum melakukan Check In hari ini.",
            };
        }

        // Sudah melakukan Check Out
        if (presensi.jam_keluar) {
            return {
                message:
                    "Anda sudah melakukan Check Out hari ini.",
            };
        }

        // Update Check Out
        await prisma.presensi.update({
            where: {
                id: presensi.id,
            },
            data: {
                foto_keluar: images,
                checkOutLatitude,
                checkOutLongitude,
                jam_keluar: now,
            },
        });
    } catch (error) {
        console.error(
            "CREATE CHECK OUT ERROR:",
            error
        );

        return {
            message:
                "Gagal menyimpan data Check Out.",
        };
    }

    revalidatePath("/presensi");
    redirect("/presensi");
};