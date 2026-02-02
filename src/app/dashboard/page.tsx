"use client";

import { useEffect, useState } from "react";

interface Delivery {
  _id: string;
  status: string;
  kitchenId: { name: string; district: string };
  schoolId: { name: string; address: string };
  totalPortions: number;
  menuItems: string[];
}

export default function DashboardPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/deliveries");
        const json = await res.json();
        if (json.success) {
          setDeliveries(json.data);
        }
      } catch (error) {
        console.error("gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Monitoring MBG 🍱
          </h1>
          <p className="text-gray-500">
            Pantau pergerakan distribusi makanan bergizi secara real-time.
          </p>
        </header>

        {/* Statistik Singkat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">
              Total Pengiriman Hari Ini
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {deliveries.length}
            </p>
          </div>
          {/* Card dummy lainnya */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Total Porsi</h3>
            <p className="text-3xl font-bold text-gray-900">
              {deliveries.reduce((acc, curr) => acc + curr.totalPortions, 0)}
            </p>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Jadwal Pengiriman Aktif
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-900 font-semibold border-b">
                  <tr>
                    <th className="p-4">Status</th>
                    <th className="p-4">Dapur Asal</th>
                    <th className="p-4">Sekolah Tujuan</th>
                    <th className="p-4">Menu</th>
                    <th className="p-4 text-right">Porsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deliveries.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                        >
                          {item.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {item.kitchenId.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.kitchenId.district}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {item.schoolId.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.schoolId.address}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {item.menuItems.map((menu, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs"
                            >
                              {menu}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-right font-medium text-gray-900">
                        {item.totalPortions} Box
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {deliveries.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Belum ada jadwal pengiriman.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
