"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useUser } from "@/contexts/UserContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { CouponPercentIcon } from "@hugeicons/core-free-icons";
import { TopupByCode } from "@/lib/database/users";

export default function CodeTopup() {
  const [code, setCode] = useState("");
  const { data: session } = useSession();
  const { refreshUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("กรุณาเข้าสู่ระบบก่อนทำรายการ");
      return;
    }

    if (!code || code.trim() === "") {
      toast.error("กรุณากรอกโค้ดเติมเงิน");
      return;
    }

    const loadingToast = toast.loading("กำลังเติมเงิน...");
    const s = await TopupByCode(session.user.id, code.trim());
    toast.dismiss(loadingToast);
    if (!s.status) {
      toast.error(s.message || "เติมเงินไม่สำเร็จ");
      return;
    }
    toast.success(s.message || "เติมเงินสำเร็จ");
    await refreshUser();
    setCode("");
    return;
  };

  return (
    <div className="w-full mx-auto shadow border border-gray-200 bg-white rounded-2xl p-5 space-y-4">
      {/* หัวข้อ */}
      <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        เติมเงินผ่านโค้ด
      </h1>

      {/* ฟอร์ม */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          {/* ไอคอนใน input */}
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <HugeiconsIcon icon={CouponPercentIcon} className="text-gray-400" size={20} />
          </div>

          <input
            id="code"
            name="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="กรอกโค้ดเติมเงินที่นี่"
            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 text-gray-800 text-sm placeholder:text-gray-400"
          />
        </div>

        <button
          type="submit"
          className="w-full btn-main text-white font-medium py-2.5 rounded-lg shadow-md transition-all"
        >
          ยืนยันโค้ดเติมเงิน
        </button>
      </form>
    </div>
  );
}
