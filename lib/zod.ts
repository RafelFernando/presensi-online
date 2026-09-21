import { z } from "zod";

export const checkInSchema = z.object({
    checkInLatitude: z.coerce
        .number()
        .min(-90, "Latitude tidak valid")
        .max(90, "Latitude tidak valid"),

    checkInLongitude: z.coerce
        .number()
        .min(-180, "Longitude tidak valid")
        .max(180, "Longitude tidak valid"),
    catatan_masuk: z.string().optional(),
});

export const checkOutSchema = z.object({
    checkOutLatitude: z.coerce
        .number()
        .min(-90, "Latitude tidak valid")
        .max(90, "Latitude tidak valid"),

    checkOutLongitude: z.coerce
        .number()
        .min(-180, "Longitude tidak valid")
        .max(180, "Longitude tidak valid"),
    catatan_keluar: z.string().optional(),
});