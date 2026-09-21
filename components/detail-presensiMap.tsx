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

interface PresensiMapProps {
    latitude: number;
    longitude: number;
    title: string;
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

export default function PresensiMap({
    latitude,
    longitude,
    title,
}: PresensiMapProps) {
    return (
        <div className="h-64 w-full overflow-hidden rounded-xl border border-gray-200">
            <MapContainer
                center={[latitude, longitude]}
                zoom={17}
                scrollWheelZoom={true}
                className="h-full w-full"
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
                    position={[latitude, longitude]}
                    icon={locationIcon}
                >
                    <Popup>
                        <strong>{title}</strong>
                        <br />
                        {latitude.toFixed(6)},{" "}
                        {longitude.toFixed(6)}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}