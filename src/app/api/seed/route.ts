import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Kitchen from "@/models/Kitchen";
import School from "@/models/School";
import DeliveryBatch from "@/models/DeliveryBatch";

export async function GET() {
  try {
    await connectDB();

    //? Hapus Data Lama (Reset)
    await Kitchen.deleteMany({});
    await School.deleteMany({});
    await DeliveryBatch.deleteMany({});

    //? Seeder Data Dapur (Kitchen)
    const kitchen = await Kitchen.create({
      name: "Dapur Pusat SPPG Surabaya",
      address: "Jl. Walikota Mustajab No. 1",
      district: "Genteng",
      capacity: 5000,
      location: {
        type: "Point",
        coordinates: [112.7508, -7.2606], //! [Longitude, Latitude]
      },
      contactNumber: "08123456789",
      isActive: true,
    });

    //? Seeder Data Sekolah (Schools)
    const schools = await School.insertMany([
      {
        name: "SDN Ketabang 1", //! Dekat Dapur
        npsn: "20532100",
        address: "Jl. Ambengan No. 12",
        totalStudents: 350,
        location: {
          type: "Point",
          coordinates: [112.755, -7.255],
        },
        recipientName: "Bpk. Budi Santoso",
      },
      {
        name: "SMPN 1 Surabaya", //! Agak Jauh
        npsn: "20532200",
        address: "Jl. Pacar No. 4",
        totalStudents: 800,
        location: {
          type: "Point",
          coordinates: [112.753, -7.258],
        },
        recipientName: "Ibu Siti Aminah",
      },
    ]);

    //? Simulasi Pengiriman (DeliveryBatch)
    const delivery = await DeliveryBatch.create({
      kitchenId: kitchen._id,
      schoolId: schools[0]._id, //! SDN Ketabang
      driverId: "DRIVER-001",
      menuItems: ["Nasi Putih", "Ayam Kecap", "Sayur Sop", "Buah Pisang"],
      totalPortions: 350,
      status: "ON_THE_WAY", //! Status sedang jalan

      timeline: {
        startCooking: new Date(Date.now() - 3 * 60 * 60 * 1000), //? 3 jam lalu
        finishCooking: new Date(Date.now() - 1 * 60 * 60 * 1000), //? 1 jam lalu
        pickedUp: new Date(Date.now() - 30 * 60 * 1000), //? 30 menit lalu
      },

      //? Posisi Kurir Terkini (Simulasi di tengah jalan antara Dapur & Sekolah)
      currentLocation: {
        lat: -7.257,
        lng: 112.753,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Database seeded successfully! 🌱",
      data: {
        kitchen: kitchen.name,
        totalSchools: schools.length,
        activeDelivery: delivery.status,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
