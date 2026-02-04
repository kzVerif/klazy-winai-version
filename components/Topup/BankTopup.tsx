"use client";

import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { TopupByBank } from "@/lib/database/users";
import { useSession } from "next-auth/react";
import { useUser } from "@/contexts/UserContext";
import jsQR from "jsqr";

export default function BankTopup({ bank }: { bank: any }) {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const { refreshUser } = useUser();

  const bankProviderMap: Record<string, string> = {
    "01002": "ธนาคารกรุงเทพ (Bangkok Bank)",
    "01004": "ธนาคารกสิกรไทย (Kasikorn Bank)",
    "01006": "ธนาคารกรุงไทย (Krung Thai Bank)",
    "01011": "ธนาคารทหารไทยธนชาต (TMB Thanachart Bank)",
    "01014": "ธนาคารไทยพาณิชย์ (SCB)",
    "01025": "ธนาคารกรุงศรีอยุธยา (Krungsri Bank)",
    "01069": "ธนาคารเกียรตินาคินภัทร (Kiatnakin Bank)",
    "01022": "ธนาคารซีไอเอ็มบีไทย (CIMB Thai Bank)",
    "01067": "ธนาคารทิสโก้ (TISCO Bank)",
    "01024": "ธนาคารยูโอบี (UOB)",
    "01071": "ธนาคารไทยเครดิต (Thai Credit Bank)",
    "01073": "ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)",
    "01070": "ธนาคารไอซีบีซี (ไทย) (ICBC Thai)",
    "01098": "SME Bank",
    "01034": "BAAC",
    "01035": "EXIM Bank",
    "01030": "ออมสิน (GSB)",
    "01033": "อาคารสงเคราะห์ (GHB)",
    "01066": "Islamic Bank",
    "02001": "PromptPay เบอร์โทรศัพท์",
    "02003": "PromptPay บัตรประชาชน/ภาษี",
    "02004": "PromptPay E-Wallet",
    "03000": "K+ Shop / แม่มณี / Be Merchant / TTB Smart Shop",
    "04000": "True Money Wallet",
  };

  const getBankName = (code?: string) =>
    code ? bankProviderMap[code] || code : "-";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    if (selected.size > 1 * 1024 * 1024) {
      toast.error("ไฟล์มีขนาดใหญ่เกิน 1MB กรุณาอัปโหลดไฟล์ที่เล็กกว่านี้");
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("กรุณาเข้าสู่ระบบก่อนทำรายการ");
      return;
    }

    if (!file) {
      toast.error("กรุณาแนบสลิปมาด้วย");
      return;
    }

    // 1) โหลดไฟล์เป็นรูปภาพ
    const imageURL = URL.createObjectURL(file);
    const img = new Image();
    img.src = imageURL;

    img.onload = async () => {
      // 2) สร้าง canvas เพื่ออ่าน pixel
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        toast.error("ไม่สามารถอ่านภาพได้");
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      // 3) อ่านข้อมูลพิกเซล
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 4) decode QR Code
      const qr = jsQR(imageData.data, canvas.width, canvas.height);

      if (!qr) {
        toast.error("ไม่พบ QR Code ในภาพนี้");
        return;
      }
      toast.loading("กำลังเติมเงิน...");

      const status = await TopupByBank(session.user.id, qr.data);
      toast.dismiss()
      if (!status?.status) {
        toast.error(status?.message || "เกิดข้อผิดพลาด");
        setTimeout(() => toast.dismiss(), 1500);
        return;
      }

      toast.success(`${status?.message}`);
      toast.dismiss()
      await refreshUser();

      URL.revokeObjectURL(imageURL);
    };
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-5">
      {/* Header */}
      <div className="flex gap-2 mb-4">
        <h1 className="text-xl text-left font-bold text-gray-800">
          เติมเงินผ่าน ธนาคาร
        </h1>
      </div>

      {/* Bank Info */}
      <div className="bg-[var(--color-secondary)]/50 rounded-xl p-4 space-y-2">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">ธนาคาร:</span>{" "}
          {getBankName(bank.bankProvider)}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">เลขบัญชี:</span>{" "}
          <span className="font-bold">{bank.bankAccount || "-"}</span>
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">ชื่อบัญชี:</span>{" "}
          {bank.bankName || "-"}
        </p>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-5 cursor-pointer hover:border-blue-400 transition">
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <ImageIcon className="text-gray-400" size={40} />
            <span className="text-gray-600 text-sm font-medium">
              {file ? "เปลี่ยนรูปสลิป" : "คลิกเพื่อเลือกหรือวางรูปสลิปที่นี่"}
            </span>
            <span className="text-xs text-gray-400">
              รองรับไฟล์ .jpg .png .jpeg (ไม่เกิน 1MB)
            </span>

            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="Slip Preview"
                className="mt-3 w-full max-w-xs object-contain rounded-md border"
              />
            )}
          </label>

          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          className="w-full btn-main font-medium py-2.5 rounded-lg shadow-md transition-all"
        >
          ตรวจสอบสลิป
        </button>
      </form>
    </div>
  );
}
