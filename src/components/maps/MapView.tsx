"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  kitchenLoc: [number, number]; // [Lat, Lng]
  schoolLoc: [number, number];
  driverLoc?: [number, number]; // Opsional, karena mungkin belum jalan
}

export default function MapView({
  kitchenLoc,
  schoolLoc,
  driverLoc,
}: MapViewProps) {
  //? Hitung titik tengah peta agar semua marker terlihat
  const center: [number, number] = [
    (kitchenLoc[0] + schoolLoc[0]) / 2,
    (kitchenLoc[1] + schoolLoc[1]) / 2,
  ];

  const routePath = driverLoc ? [kitchenLoc, driverLoc] : [];
  const remainingPath = driverLoc
    ? [driverLoc, schoolLoc]
    : [kitchenLoc, schoolLoc];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-inner border border-gray-200 z-0 relative">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker Dapur */}
        <Marker position={kitchenLoc}>
          <Popup>🍳 Dapur Pusat</Popup>
        </Marker>

        {/* Marker Sekolah */}
        <Marker position={schoolLoc}>
          <Popup>🏫 Sekolah Tujuan</Popup>
        </Marker>

        {/* Marker Kurir (Jika ada) */}
        {driverLoc && (
          <Marker position={driverLoc} icon={DefaultIcon}>
            <Popup>🚚 Posisi Kurir Terkini</Popup>
          </Marker>
        )}

        {/* Garis Jalur yang Sudah Dilewati */}
        {driverLoc && (
          <Polyline positions={routePath as any} color="blue" weight={4} />
        )}

        {/* Garis Sisa Perjalanan */}
        <Polyline
          positions={remainingPath as any}
          color="gray"
          dashArray="10, 10" // Garis putus-putus
          weight={2}
        />
      </MapContainer>
    </div>
  );
}
