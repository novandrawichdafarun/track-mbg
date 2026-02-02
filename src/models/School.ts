import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISchool extends Document {
  name: string;
  npsn: string; //! ID Unik Sekolah
  address: string;
  totalStudents: number; //! Jumlah porsi yang dibutuhkan
  location: {
    type: "Point";
    coordinates: number[];
  };
  recipientName: string; //! Nama Kepsek/Penanggungjawab
}

const SchoolSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    npsn: { type: String, unique: true, required: true },
    address: { type: String, required: true },
    totalStudents: { type: Number, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    recipientName: { type: String, required: true },
  },
  { timestamps: true },
);

const School: Model<ISchool> =
  mongoose.models.School || mongoose.model<ISchool>("School", SchoolSchema);

export default School;
