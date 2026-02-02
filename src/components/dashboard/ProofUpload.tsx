"use client";

import { useRef, useState } from "react";
import { Camera, X, CheckCircle, PenTool, Eraser } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

interface ProofUploadProps {
  deliveryId: string;
  onSuccess: () => void;
}

export default function ProofUpload({
  deliveryId,
  onSuccess,
}: ProofUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  //? State Form
  const [recipient, setRecipient] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //? Ref Signature Pad
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isSigned, setIsSigned] = useState(false);

  //? Handle File Input & Convert to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  //? Clear Signature
  const clearSignature = () => {
    sigCanvas.current?.clear();
    setIsSigned(false);
  };

  //? Submit Data ke API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !recipient || !isSigned) return;

    const signatureImage = sigCanvas.current
      ?.getTrimmedCanvas()
      .toDataURL("image/png");

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/deliveries/${deliveryId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: recipient,
          photoBase64: imagePreview,
          signatureBase64: signatureImage,
          notes: notes,
        }),
      });

      if (res.ok) {
        onSuccess(); // Refresh halaman/state
      } else {
        alert("Gagal mengupload bukti.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 mt-4 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
        <CheckCircle className="w-5 h-5 text-blue-600" />
        Form Serah Terima
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input Penerima */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              Nama Penerima
            </label>
            <input
              type="text"
              placeholder="Contoh: Bpk. Budi (Kepala Sekolah)"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none mt-1"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Diterima dalam kondisi baik"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none mt-1"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Input Kamera/File */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
            Foto Barang
          </label>
          {!imagePreview ? (
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-blue-400 transition-all">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Camera className="w-8 h-8 mb-1" />
              <span className="text-xs">Ambil Foto</span>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-gray-200 h-48 bg-black">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Tanda Tangan */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
              <PenTool className="w-3 h-3" /> Tanda Tangan Penerima
            </label>
            <button
              type="button"
              onClick={clearSignature}
              className="text-xs text-red-500 flex items-center gap-1 hover:underline"
            >
              <Eraser className="w-3 h-3" /> Hapus
            </button>
          </div>

          <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 touch-none">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                className: "w-full h-40", // Tinggi canvas
              }}
              backgroundColor="rgb(249, 250, 251)" // bg-gray-50
              onEnd={() => setIsSigned(true)}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            *Tanda tangan di dalam kotak di atas
          </p>
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={!imagePreview || !recipient || !isSigned || isSubmitting}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            "Mengirim..."
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Konfirmasi
            </>
          )}
        </button>
      </form>
    </div>
  );
}
