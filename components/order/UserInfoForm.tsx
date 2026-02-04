"use client";

import {
  LockPasswordIcon,
  SmartPhone02Icon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";

type Props = {
  userInfo: {
    id_user: string
    password_user: string
    contact_user: string
  }
  setUserInfo: React.Dispatch<React.SetStateAction<any>>
}

export default function UserInfoForm({ userInfo, setUserInfo }: Props) {
  return (
    <>
        <div className=" bg-neutral-50 border border-neutral-300 rounded-xl p-6 space-y-4">
          <h2 className="flex gap-2 text-lg font-semibold text">
            <HugeiconsIcon icon={User02Icon} strokeWidth={2} />
            ข้อมูลคำสั่งซื้อ
          </h2>
          {/* ID */}
          <div className="relative">
            <Label className="text-sm text-neutral-800">ไอดีเกม</Label>
            <HugeiconsIcon
              icon={User02Icon}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 translate-y-0.5 text-neutral-500"
            />
            <Input
              type="text"
              placeholder="กรอกไอดีเกมของลูกค้า"
              value={userInfo.id_user}
              onChange={(e) => setUserInfo((prev: any) => ({ ...prev, id_user: e.target.value}))}
              className="px-14 py-6 rounded-lg mt-2 font-medium bg-white"
            />
          </div>
          {/* Password */}
          <div className="relative">
            <Label className="text-sm text-neutral-800">รหัสผ่าน</Label>
            <HugeiconsIcon
              icon={LockPasswordIcon}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 translate-y-0.5 text-neutral-500"
            />
            <Input
              type="password"
              placeholder="กรอกรหัสผ่านกมของลูกค้า"
              value={userInfo.password_user}
              onChange={(e) => setUserInfo((prev: any) => ({ ...prev, password_user: e.target.value}))}
              className="pl-14 py-6 rounded-lg mt-2 font-medium bg-white"
            />
          </div>
          {/* Contact */}
          <div className="relative">
            <Label className="text-sm text-neutral-800">ช่องทางติดต่อ</Label>
            <HugeiconsIcon
              icon={SmartPhone02Icon}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 translate-y-0.5 text-neutral-500"
            />
            <Input
              type="text"
              placeholder="เช่น ลิ้ง Facebook / @ LINE"
              value={userInfo.contact_user}
              onChange={(e) => setUserInfo((prev: any) => ({ ...prev, contact_user: e.target.value}))}
              className="px-14 py-6 rounded-lg mt-2 font-medium bg-white"
            />
          </div>
        </div>
    </>
  );
}
