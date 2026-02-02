import mongoose, { Document, Model, Schema } from "mongoose";

export type BatchStatus =
  | "PLANNED" //? Terjadwal
  | "COOKING" //? Sedang Dimasak
  | "PACKING" //? Sedang Dipacking
  | "READY_TO_SHIP" //? Menunggu Kurir
  | "ON_THE_WAY" //? Kurir Jalan (GPS Aktif)
  | "DELIVERED" //? Sampai Lokasi
  | "COMPLETED"; //? Sudah divalidasi Sekolah

export interface IDeliveryBatch extends Document {
  date: Date; //* Tanggal Pengantaran
  kitchenId: mongoose.Types.ObjectId; //* Relasi ke Dapur
  schoolId: mongoose.Types.ObjectId; //* Relasi ke Sekolah
  driverId?: string; //* ID/Nama Driver (Bisa relasi ke User nanti)

  menuItems: string[]; //* Contoh: ["Nasi", "Ayam", "Sayur Sop"]
  totalPortions: number;

  status: BatchStatus;

  //? Tracking Waktu (Penting untuk Audit)
  timeline: {
    startCooking?: Date;
    finishCooking?: Date; //* Makanan matang
    pickedUp?: Date; //* Diambil driver
    arrived?: Date; //* Sampai sekolah
  };

  //? Posisi Terkini Kurir (Diupdate real-time via API)
  currentLocation?: {
    lat: number;
    lng: number;
    updatedAt: Date;
  };

  //? Bukti Pengiriman
  proofOfDelivery?: {
    photoUrl: string;
    recipientSignature?: string;
    notes?: string;
  };
}

const DeliveryBatchSchema: Schema = new Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    kitchenId: { type: Schema.Types.ObjectId, ref: "Kitchen", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    driverId: { type: String }, //! Nanti bisa diubah ke ObjectId jika ada tabel User

    menuItems: [{ type: String }],
    totalPortions: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "PLANNED",
        "COOKING",
        "PACKING",
        "READY_TO_SHIP",
        "ON_THE_WAY",
        "DELIVERED",
        "COMPLETED",
      ],
      default: "PLANNED",
      index: true,
    },

    timeline: {
      startCooking: Date,
      finishCooking: Date,
      pickedUp: Date,
      arrived: Date,
    },

    currentLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },

    proofOfDelivery: {
      recipientName: String,
      photoUrl: String,
      recipientSignature: String,
      notes: String,
    },
  },
  { timestamps: true },
);

const DeliveryBatch: Model<IDeliveryBatch> =
  mongoose.models.DeliveryBatch ||
  mongoose.model<IDeliveryBatch>("DeliveryBatch", DeliveryBatchSchema);
export default DeliveryBatch;
