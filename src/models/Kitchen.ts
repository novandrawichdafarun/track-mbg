import mongoose, { Document, Model, Schema } from "mongoose";

//? Tipe Data (TypeScript Interface)
export interface IKitchen extends Document {
  name: string;
  address: string;
  district: string; //* Kecamatan
  capacity: number; //* Kapasitas porsi per hari
  location: {
    type: "Point";
    coordinates: number[]; //* [Longitude, Latitude]
  };
  contactNumber: string;
  isActive: boolean;
}

//? Schema Mongoose
const KitchenSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    district: { type: String, required: true, index: true }, //* Index untuk filter cepat
    capacity: { type: Number, default: 0 },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, //! Untuk Peta
    },
    contactNumber: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

//? Indexing Geospatial (query lokasi  radius)
KitchenSchema.index({ location: "2dsphere" });

const Kitchen: Model<IKitchen> =
  mongoose.models.Kitchen || mongoose.model<IKitchen>("Kitchen", KitchenSchema);

export default Kitchen;
