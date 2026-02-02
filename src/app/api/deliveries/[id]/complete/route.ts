import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DeliveryBatch from "@/models/DeliveryBatch";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { recipientName, photoBase64, signatureBase64, notes } = body;

    await connectDB();

    const delivery = await DeliveryBatch.findByIdAndUpdate(
      id,
      {
        status: "DELIVERED",
        "timeline.arrived": new Date(),
        proofOfDelivery: {
          recipientName: recipientName,
          photoUrl: photoBase64, // Simpan string base64 gambar
          recipientSignature: signatureBase64, // Simpan string base64 TTD
          notes: notes,
          timestamp: new Date(),
        },
      },
      { new: true },
    );

    if (!delivery) {
      return NextResponse.json(
        { error: "Delivery not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: delivery });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
