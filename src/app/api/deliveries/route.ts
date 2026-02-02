import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DeliveryBatch from "@/models/DeliveryBatch";

//? import model
import "@/models/Kitchen";
import "@/models/School";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    //? Ambil semua data, urut byang terbaru
    const deliveries = await DeliveryBatch.find({})
      .populate("kitchenId", "name district location") //* Ambil field name & district saja dari Kitchen
      .populate("schoolId", "name address location") //* Ambil field name & address saja dari School
      .sort({ createAt: -1 });

    return NextResponse.json({ success: true, data: deliveries });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
