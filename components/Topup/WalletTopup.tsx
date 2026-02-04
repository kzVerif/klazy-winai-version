"use client";
import React, { useState } from "react";
import { Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { TopupByWallet } from "@/lib/database/users";
import { useSession } from "next-auth/react";
import { useUser } from "@/contexts/UserContext";

export default function WalletTopup() {
  const [link, setLink] = useState("");
  const {data: session} = useSession()
  const { refreshUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("กรุณาเข้าสู่ระบบก่อนทำรายการ")
      return
    }
    if (link === "" || link === undefined || link === null) {
      toast.error("กรุณากรอกลิงก์")
      return
    }    
    
    toast.loading("กำลังเติมเงิน...")
    const status = await TopupByWallet(session?.user.id, link)
    console.log("status in WAlletTopup",status);
    
    if (!status?.status) {
      toast.dismiss()
      toast.error(status?.message)
      return
    }

    toast.success("เติมเงินสำเร็จ")
    setLink(""); // เคลียร์ช่องหลังส่ง
    await refreshUser();
  };

  return (
    <div className="w-full mx-auto shadow border border-gray-200 bg-white rounded-2xl p-5 space-y-4">
      {/* หัวข้อ */}
      <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        เติมเงินผ่าน TrueMoney Wallet
      </h1>

      {/* ฟอร์ม */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          {/* ไอคอนใน input */}
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Wallet className="text-gray-400" size={20} />
          </div>

          <input
            id="link"
            name="link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="วางลิงก์สลิปซองอั่งเปาที่นี่"
            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 text-gray-800 text-sm  placeholder:text-gray-400"
          />
        </div>

        <button
          type="submit"
          className="w-full btn-main text-white font-medium py-2.5 rounded-lg shadow-md transition-all"
        >
          เติมเงินเลย
        </button>

        {/* <p className="text-red-500 text-sm"> ยอดที่ได้รับจะหักค่าธรรมเนียม 2.9% สูงสุด 20 บาท</p> */}
      </form>

    </div>
  );
}
