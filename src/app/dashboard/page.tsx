"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import DeliveryList from "@/components/dashboard/DeliveryList";
import DeliveryDetail from "@/components/dashboard/DeliveryDetail";
import { Delivery } from "@/types";
import { getCoords } from "@/lib/utils";

//? Import Peta Dynamic
const MapView = dynamic(() => import("@/components/maps/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-100 w-full bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
      Memuat Peta...
    </div>
  ),
});

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

  return (
    <div className="p-8">
      {/* ... Header ... */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <DeliveryList
            deliveries={deliveries}
            selectedId={selectedDelivery?._id}
            onSelect={setSelectedDelivery}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
            {/* Menggunakan helper getCoords() yang lebih bersih */}
            {selectedDelivery &&
            selectedDelivery.kitchenId.location &&
            selectedDelivery.schoolId.location ? (
              <MapView
                kitchenLoc={getCoords(
                  selectedDelivery.kitchenId.location.coordinates,
                )}
                schoolLoc={getCoords(
                  selectedDelivery.schoolId.location.coordinates,
                )}
                driverLoc={
                  simulatedPos
                    ? [simulatedPos.lat, simulatedPos.lng]
                    : undefined
                }
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl">
                Pilih pengiriman untuk melihat peta
              </div>
            )}
          </div>

          <DeliveryDetail data={selectedDelivery} />
        </div>
      </div>
    </div>
  );
}
