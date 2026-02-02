import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

//? Helper untuk menggabungkan class Tailwind (Standar Shadcn/UI)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//? Helper Warna Status
export const getStatusColor = (status: string) => {
  switch (status) {
    case "ON_THE_WAY":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "COOKING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "DELIVERED":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

//? Helper Konversi Koordinat [Lng, Lat] (MongoDB) -> [Lat, Lng] (Leaflet)
export function getCoords(coords: number[] | undefined): [number, number] {
  if (!coords || coords.length < 2) return [0, 0]; // Default fallback
  return [coords[1], coords[0]];
}

//? Helper Format Status agar enak dibaca
//* Contoh: "ON_THE_WAY" -> "On The Way"
export function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

//? Helper Format Tanggal Indonesia
export function formatDate(dateString: string | undefined) {
  if (!dateString) return "-";
  return (
    new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " WIB"
  );
}
