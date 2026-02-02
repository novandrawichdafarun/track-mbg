import { useState } from "react";
import {
  ScrollText,
  Thermometer,
  MapPin,
  CheckCircle,
  Package,
} from "lucide-react";
import ProofUpload from "./ProofUpload";
import { cn, formatStatus, getStatusColor } from "@/lib/utils";

export default function DeliveryDetail({ data }: { data: any }) {
  if (!data) return null;

  const handleSuccess = () => {
    window.location.reload(); // Refresh halaman untuk update status
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Detail Status</h3>
          <p className="text-sm text-gray-500">ID: {data._id}</p>
        </div>

        {/* Badge Status Besar */}
        <div
          className={cn(
            "px-4 py-2 rounded-lg font-bold text-sm",
            getStatusColor(data.status),
          )}
        >
          {formatStatus(data.status)}
        </div>
      </div>

      {/* Statistik total porsi */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <Package className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Total Porsi</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {data.totalPortions} Box
          </p>
        </div>

        {/* Statistik Menu Utama */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-2 text-blue-700">
            <ScrollText className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Menu Utama</span>
          </div>
          <p className="text-xl font-bold text-blue-800">{data.menuItems[0]}</p>
        </div>

        {/* Statistik Lokasi Dapur */}
        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
          <div className="flex items-center gap-2 mb-2 text-yellow-700">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">
              Alamat Sekolah
            </span>
          </div>
          <p className="text-xl font-bold text-yellow-800">
            {data.schoolId.address}
          </p>
        </div>

        {/* Statistik Suhu */}
        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="flex items-center gap-2 mb-2 text-green-700">
            <Thermometer className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Suhu</span>
          </div>
          <p className="text-xl font-bold text-green-800">58°C</p>
        </div>
      </div>

      {/* --- LOGIKA BARU DI SINI --- */}
      <div className="border-t border-gray-100 pt-6">
        {/* SKENARIO 1: Barang Sedang Jalan -> Butuh Upload */}
        {data.status === "ON_THE_WAY" && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              Konfirmasi Kedatangan
            </h4>
            <p className="text-sm text-blue-700 mb-4">
              Kurir diharapkan mengupload bukti foto saat makanan sampai di
              sekolah.
            </p>
            <ProofUpload deliveryId={data._id} onSuccess={handleSuccess} />
          </div>
        )}

        {/* SKENARIO 2: Barang Sudah Sampai -> Tampilkan Bukti */}
        {data.status === "DELIVERED" && data.proofOfDelivery && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Bukti Penerimaan (Proof of Delivery)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* KOLOM KIRI: Foto Bukti */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Foto Dokumentasi
                </span>
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
                  <img
                    src={data.proofOfDelivery.photoUrl}
                    alt="Bukti Terima"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* KOLOM KANAN: Detail & Tanda Tangan */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-bold">
                    Diterima Oleh
                  </span>
                  <p className="text-lg font-semibold text-gray-900">
                    {data.proofOfDelivery.recipientName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(
                      data.proofOfDelivery.timestamp || data.updatedAt,
                    ).toLocaleString()}
                  </p>
                </div>

                {/* Tampilan Tanda Tangan */}
                {data.proofOfDelivery.recipientSignature && (
                  <div className="mt-4">
                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">
                      Tanda Tangan Digital
                    </span>
                    <div className="bg-white border border-gray-200 rounded-lg p-2 inline-block">
                      <img
                        src={data.proofOfDelivery.recipientSignature}
                        alt="Tanda Tangan"
                        className="h-20 object-contain" // Tinggi 80px
                      />
                    </div>
                  </div>
                )}

                {data.proofOfDelivery.notes && (
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <span className="text-xs text-gray-500 uppercase font-bold">
                      Catatan
                    </span>
                    <p className="text-gray-700 italic text-sm">
                      "{data.proofOfDelivery.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
