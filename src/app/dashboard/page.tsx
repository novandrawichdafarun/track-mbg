"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

//? Import Peta Dynamic
const MapView = dynamic(() => import("@/components/maps/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-100 w-full bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
      Memuat Peta...
    </div>
  ),
});

interface Delivery {
  _id: string;
  status: string;
  kitchenId: {
    name: string;
    district: string;
    location: { coordinates: number[] };
  };
  schoolId: {
    name: string;
    address: string;
    location: { coordinates: number[] };
  };
  currentLocation?: { lat: number; lng: number };
  totalPortions: number;
  menuItems: string[];
}

export default function DashboardPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  //? State Simulasi
  const [simulatedPos, setSimulatedPos] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  //? fetch data Delivery
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/deliveries");
        const json = await res.json();
        if (json.success) {
          setDeliveries(json.data);
          if (json.data.length > 0) setSelectedDelivery(json.data[0]);
        }
      } catch (error) {
        console.error("gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  //? Simulasi saat Delivery Dipilih
  useEffect(() => {
    if (selectedDelivery?.currentLocation) {
      setSimulatedPos({
        lat: selectedDelivery.currentLocation.lat,
        lng: selectedDelivery.currentLocation.lng,
      });
    }

    //? Reset Interval lama
    if (simulationInterval.current) clearInterval(simulationInterval.current);

    //? Cek kelengkapan data lokasi
    if (selectedDelivery && selectedDelivery.schoolId.location) {
      const targetLat = selectedDelivery.schoolId.location.coordinates[1];
      const targetLng = selectedDelivery.schoolId.location.coordinates[0];

      //Todo: Jalankan TImer setiap 1 detik
      simulationInterval.current = setInterval(() => {
        setSimulatedPos((prev) => {
          if (!prev) return prev;

          //! Logika Matematika: Gerakkan 0.5% jarak setiap detik
          const step = 0.005;
          const newLat = prev.lat + (targetLat - prev.lat) * step;
          const newLng = prev.lng + (targetLng - prev.lng) * step;

          //? Stop jika sudah sangat dekat (selisih < 0.0001)
          if (Math.abs(targetLat - newLat) < 0.0001) {
            if (simulationInterval.current)
              clearInterval(simulationInterval.current);
            return prev;
          }

          return { lat: newLat, lng: newLng };
        });
      }, 1000); //! update setiap 1 detik
    }

    return () => {
      if (simulationInterval.current) clearInterval(simulationInterval.current);
    };
  }, [selectedDelivery]);

  // Tampilan helper untuk mewarnai status
  const getStatusColor = (status: string) => {
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

  // Helper function untuk menukar koordinat [Long, Lat] (MongoDB) ke [Lat, Long] (Leaflet)
  const getCoords = (coords: number[]): [number, number] => [
    coords[1],
    coords[0],
  ];

  // Render Helper agar kode HTML lebih bersih
  const renderMap = () => {
    if (
      !selectedDelivery ||
      !selectedDelivery.kitchenId.location ||
      !selectedDelivery.schoolId.location
    ) {
      return (
        <div className="h-[400px] bg-gray-100 flex items-center justify-center text-gray-400">
          Pilih Data Pengiriman
        </div>
      );
    }

    // Gunakan posisi simulasi jika ada, jika tidak gunakan posisi database
    const driverPosition = simulatedPos
      ? [simulatedPos.lat, simulatedPos.lng]
      : undefined;

    return (
      <MapView
        kitchenLoc={getCoords(selectedDelivery.kitchenId.location.coordinates)}
        schoolLoc={getCoords(selectedDelivery.schoolId.location.coordinates)}
        driverLoc={driverPosition as [number, number]}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Monitoring MBG 🍱
            </h1>
            <p className="text-sm text-gray-500">
              Pantau distribusi makanan gratis secara real-time
            </p>
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
            ● Live System
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom KIRI: List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-semibold text-gray-700">Jadwal Aktif</h2>
            <div className="space-y-3 h-[500px] overflow-y-auto pr-2">
              {loading ? (
                <p>Loading...</p>
              ) : (
                deliveries.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedDelivery(item)}
                    className={`p-4 rounded-lg cursor-pointer border transition-all ${
                      selectedDelivery?._id === item._id
                        ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500"
                        : "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${item.status === "ON_THE_WAY" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-gray-400">
                        ID: {item._id.slice(-4)}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800">
                      {item.schoolId.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      dari {item.kitchenId.name}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Kolom KANAN: Peta & Detail */}
          <div className="lg:col-span-2 space-y-6">
            {/* PETA */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              {renderMap()}
            </div>

            {/* DETAIL INFO */}
            {selectedDelivery && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                  Detail Pengiriman
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-gray-500">Total Porsi</p>
                    <p className="font-semibold text-xl">
                      {selectedDelivery.totalPortions} Box
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Menu Utama</p>
                    <p className="font-semibold text-gray-700">
                      {selectedDelivery.menuItems[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Kecamatan</p>
                    <p className="font-semibold text-gray-700">
                      {selectedDelivery.kitchenId.district}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status Suhu</p>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <p className="font-semibold text-green-700">Optimal</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
