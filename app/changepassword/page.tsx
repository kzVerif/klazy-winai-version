import ChangePasswordForm from "@/components/Auth/ChangePasswordForm";
import React from "react";

export default function page() {
  return (
    <div className="header container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">เปลี่ยนรหัสผ่าน</h1>
        <h2 className="text-sm text-gray-500">
          เปลี่ยนรหัสผ่านเพื่อความปลอดภัยของคุณ
        </h2>
      </div>
      <ChangePasswordForm/>
    </div>
  );
}
