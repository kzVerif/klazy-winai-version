"use client";
import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { ChangePassword } from "@/lib/database/users";

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { data: session } = useSession();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- (เพิ่มส่วนนี้) ---
    if (!session?.user?.id) {
      toast.error("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
      return;
    }
    // ---

    if (newPassword !== confirmPassword) {
      toast.error("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    const data = {
      userId: session.user.id, // เอา ? ออกได้เลยเพราะเช็คแล้ว
      oldPassword,
      newPassword,
    };

    // ส่วนนี้ไม่ต้องแก้ ใช้งานได้เลยถ้า Backend ถูกแก้ไข
    await toast.promise(ChangePassword(data), {
      loading: "กำลังเปลี่ยนรหัสผ่าน...",
      success: "เปลี่ยนรหัสผ่านสำเร็จ!",
      error: (err) => err?.message || "เกิดข้อผิดพลาด",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <form onSubmit={handleSubmit} className="max-w-md w-full">
        {/* รหัสผ่านเก่า */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Lock className="text-gray-400" size={20} />
          </div>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="รหัสผ่านเก่า"
            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 text-gray-800 text-sm placeholder:text-gray-400"
          />
        </div>

        {/* รหัสผ่านใหม่ */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Lock className="text-gray-400" size={20} />
          </div>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="รหัสผ่านใหม่"
            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 text-gray-800 text-sm placeholder:text-gray-400"
          />
        </div>

        {/* ยืนยันรหัสผ่าน */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Lock className="text-gray-400" size={20} />
          </div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="ยืนยันรหัสผ่านใหม่"
            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 text-gray-800 text-sm placeholder:text-gray-400"
          />
        </div>

        <button
          type="submit"
          className="w-full btn-main text-white py-2 rounded-lg text-sm font-medium"
        >
          เปลี่ยนรหัสผ่าน
        </button>
      </form>
    </div>
  );
}
