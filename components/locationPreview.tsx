"use client";

import { useEffect } from "react";
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";
import L from "leaflet";

interface LocationPreviewProps {
    latitude: number | null;
    longitude: number | null;
    onLocationChange: (
        latitude: number,
        longitude: number
    ) => void;
}

function ChangeMapView({
    latitude,
    longitude,
}: {
    latitude: number;
    longitude: number;
}) {
    const map = useMap();

    useEffect(() => {
        map.setView([latitude, longitude], 17);
        map.invalidateSize();
    }, [latitude, longitude, map]);

    return null;
}

const locationIcon = new L.Icon({
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export default function LocationPreview({
    latitude,
    longitude,
    onLocationChange,
}: LocationPreviewProps) {
    useEffect(() => {
        if (!navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                onLocationChange(lat, lng);
            },
            (error) => {
                console.error("GPS error:", error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, [onLocationChange]);

    return (
        <div className="space-y-3">

            {/* MAP */}
            <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-xl border border-gray-300">
                {latitude !== null &&
                    longitude !== null ? (
                    <MapContainer
                        center={[latitude, longitude]}
                        zoom={17}
                        scrollWheelZoom={true}
                        className="w-full h-full"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <ChangeMapView
                            latitude={latitude}
                            longitude={longitude}
                        />

                        <Marker
                            position={[
                                latitude,
                                longitude,
                            ]}
                            icon={locationIcon}
                        >
                            <Popup>
                                Lokasi Anda
                                <br />
                                {latitude.toFixed(6)},{" "}
                                {longitude.toFixed(6)}
                            </Popup>
                        </Marker>
                    </MapContainer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center px-6">
                            <p className="text-sm text-gray-500">
                                Mengambil lokasi...
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Mohon izinkan akses lokasi pada browser.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* COORDINATES */}
            {latitude !== null &&
                longitude !== null && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500">
                                Latitude
                            </p>

                            <p className="font-medium text-gray-900 break-all">
                                {latitude.toFixed(6)}
                            </p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500">
                                Longitude
                            </p>

                            <p className="font-medium text-gray-900 break-all">
                                {longitude.toFixed(6)}
                            </p>
                        </div>
                    </div>
                )}
        </div>
    );
}