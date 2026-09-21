"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { type PutBlobResult } from "@vercel/blob";
import { useActionState, useRef, useState, useTransition, useCallback } from "react";
import clsx from "clsx";
import {
    IoCameraOutline,
    IoLocationOutline,
    IoTrashOutline,
} from "react-icons/io5";

import { Masuk } from "@/lib/action";

const LocationPreview = dynamic(
    () => import("@/components/locationPreview"),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-64 w-full items-center justify-center rounded-xl border border-gray-300 bg-gray-100 sm:h-80 md:h-96">
                <p className="text-sm text-gray-500">
                    Memuat peta...
                </p>
            </div>
        ),
    }
);

export default function CreatePresensiForm() {

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraOpen, setCameraOpen] = useState(false);

    // =========================
    // IMAGE
    // =========================

    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);

    // =========================
    // LOCATION
    // =========================

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    // =========================
    // STATE
    // =========================

    const [message, setMessage] = useState("");
    const [pending, startTransition] = useTransition();

    // =========================
    // CAMERA
    // =========================

    const openCamera = async () => {
        try {
            setMessage("");

            if (!navigator.mediaDevices?.getUserMedia) {
                setMessage(
                    "Browser tidak mendukung akses kamera atau halaman belum menggunakan HTTPS."
                );
                return;
            }

            const mediaStream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "user",
                        width: {
                            ideal: 1280,
                        },
                        height: {
                            ideal: 720,
                        },
                    },
                    audio: false,
                });

            setStream(mediaStream);
            setCameraOpen(true);

            setTimeout(async () => {
                if (!videoRef.current) return;

                videoRef.current.srcObject = mediaStream;

                try {
                    await videoRef.current.play();
                } catch (error) {
                    console.error(
                        "Gagal menjalankan video:",
                        error
                    );
                }
            }, 100);
        } catch (error) {
            console.error("Camera error:", error);

            if (!(error instanceof DOMException)) {
                setMessage("Kamera tidak dapat dibuka.");
                return;
            }

            switch (error.name) {
                case "NotAllowedError":
                    setMessage(
                        "Izin kamera ditolak. Silakan izinkan kamera pada browser."
                    );
                    break;

                case "NotFoundError":
                    setMessage(
                        "Kamera tidak ditemukan pada perangkat."
                    );
                    break;

                case "NotReadableError":
                    setMessage(
                        "Kamera sedang digunakan aplikasi lain."
                    );
                    break;

                case "OverconstrainedError":
                    setMessage(
                        "Kamera tidak mendukung konfigurasi yang diminta."
                    );
                    break;

                default:
                    setMessage(
                        `Kamera gagal dibuka: ${error.name}`
                    );
            }
        }
    };

    const closeCamera = () => {
        stream?.getTracks().forEach((track) => {
            track.stop();
        });

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setStream(null);
        setCameraOpen(false);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        const width = video.videoWidth;
        const height = video.videoHeight;

        if (!width || !height) {
            setMessage("Kamera belum siap.");
            return;
        }

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
            setMessage("Gagal mengambil gambar.");
            return;
        }

        context.drawImage(
            video,
            0,
            0,
            width,
            height
        );

        canvas.toBlob(
            async (blob) => {
                if (!blob) {
                    setMessage("Gagal membuat file foto.");
                    return;
                }

                const file = new File(
                    [blob],
                    `presensi-${Date.now()}.jpg`,
                    {
                        type: "image/jpeg",
                    }
                );

                closeCamera();

                await uploadImage(file);
            },
            "image/jpeg",
            0.85
        );
    };

    const uploadImage = async (file: File) => {
        try {
            setUploading(true);
            setMessage("");

            const formData = new FormData();
            formData.set("file", file);

            const response = await fetch(
                "/api/upload",
                {
                    method: "PUT",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Gagal mengupload foto."
                );
                return;
            }

            const result = data as PutBlobResult;

            setImage(result.url);
        } catch (error) {
            console.error("Upload error:", error);

            setMessage(
                "Terjadi kesalahan saat mengupload foto."
            );
        } finally {
            setUploading(false);
        }
    };

    const deleteImage = (imageUrl: string) => {
        startTransition(async () => {
            try {
                const response = await fetch(
                    `/api/upload?url=${encodeURIComponent(
                        imageUrl
                    )}`,
                    {
                        method: "DELETE",
                    }
                );

                if (!response.ok) {
                    setMessage("Gagal menghapus foto.");
                    return;
                }

                setImage("");
            } catch (error) {
                console.error("Delete image error:", error);

                setMessage("Gagal menghapus foto.");
            }
        });
    };

    const handleLocationChange = useCallback(
        (lat: number, lng: number) => {
            setLatitude(lat);
            setLongitude(lng);
            setMessage("");
        },
        []
    );

    const [state, formAction, isPending] =
        useActionState(
            Masuk.bind(null, image),
            null
        );

    return (
        <form action={formAction}>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">

                <div className="rounded-lg bg-white p-5 lg:col-span-7">
                    <div className="mb-2 flex items-center gap-2">
                        <IoCameraOutline className="size-6 text-blue-600" />

                        <h2 className="text-lg font-semibold">
                            Foto Presensi
                        </h2>
                    </div>

                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">

                        {uploading ? (
                            <div className="flex h-full w-full flex-col items-center justify-center">
                                {/* SPINNER */}
                                <div className="size-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />

                                <p className="mt-4 font-medium text-gray-700">
                                    Mengupload foto...
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Mohon tunggu sebentar
                                </p>
                            </div>
                        ) : cameraOpen ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="h-full w-full object-cover"
                            />
                        ) : image ? (
                            <Image
                                src={image}
                                alt="Foto Presensi"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center text-gray-500">
                                <IoCameraOutline className="mb-3 size-12" />

                                <p className="font-medium">
                                    Foto presensi belum tersedia
                                </p>

                                <p className="mt-1 text-sm">
                                    Gunakan kamera untuk mengambil foto
                                </p>
                            </div>
                        )}

                        {/* DELETE */}
                        {image && !cameraOpen && !uploading && (
                            <button
                                type="button"
                                onClick={() => deleteImage(image)}
                                disabled={pending}
                                className="absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                <IoTrashOutline className="size-5" />
                            </button>
                        )}
                    </div>

                    {/* CAMERA ACTION */}
                    <div className="mt-4 flex gap-3">

                        {!cameraOpen && !image && (
                            <button
                                type="button"
                                onClick={openCamera}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
                            >

                                Ambil Foto
                            </button>
                        )}

                        {cameraOpen && (
                            <>
                                <button
                                    type="button"
                                    onClick={capturePhoto}
                                    disabled={uploading}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <IoCameraOutline className="size-5" />

                                    {uploading
                                        ? "Mengambil..."
                                        : "Ambil Foto"}
                                </button>

                                <button
                                    type="button"
                                    onClick={closeCamera}
                                    disabled={uploading}
                                    className="rounded-lg bg-gray-200 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Batal
                                </button>
                            </>
                        )}
                    </div>

                    <canvas
                        ref={canvasRef}
                        className="hidden"
                    />
                </div>

                <div className="rounded-lg bg-white p-5 lg:col-span-5">
                    <div className="mb-2 flex items-center gap-2">
                        <IoLocationOutline className="size-6 text-blue-600" />

                        <h2 className="text-lg font-semibold">
                            Lokasi Presensi
                        </h2>
                    </div>

                    <LocationPreview
                        latitude={latitude}
                        longitude={longitude}
                        onLocationChange={
                            handleLocationChange
                        }
                    />
                </div>
            </div>

            <input
                type="hidden"
                name="checkInLatitude"
                value={latitude ?? ""}
            />

            <input
                type="hidden"
                name="checkInLongitude"
                value={longitude ?? ""}
            />

            {message && (
                <p className="mt-4 text-sm text-red-600">
                    {message}
                </p>
            )}

            <div className="w-full p-2">
                <button
                    type="submit"
                    disabled={
                        isPending ||
                        uploading ||
                        !image ||
                        latitude === null ||
                        longitude === null
                    }
                    className={clsx(
                        "mt-3 rounded-sm w-full px-6 py-3 font-semibold text-white transition",
                        isPending ||
                            uploading ||
                            !image ||
                            latitude === null ||
                            longitude === null
                            ? "cursor-not-allowed bg-gray-400"
                            : "cursor-pointer bg-blue-600 hover:bg-blue-700"
                    )}
                >
                    {isPending
                        ? "Menyimpan..."
                        : "Masuk"}
                </button>
            </div>
        </form>
    );
}