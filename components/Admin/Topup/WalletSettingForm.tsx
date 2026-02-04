"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { updateWalletTopup, Wallet } from "@/lib/database/wallettopup";

export default function WalletSettingForm({ data }: { data: Wallet }) {
  const [enabled, setEnabled] = useState(data.available);
  const [feeEnabled, feeSetEnabled] = useState(data.feeAvailable);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ดึงข้อมูลจากฟอร์ม
    const formData = new FormData(e.currentTarget);
    const phone = String(formData.get("phone") || "");

    const updateData: Wallet = {
      id: data.id,
      phone,
      feeAvailable: feeEnabled,
      available: enabled,
    };

    toast.promise(updateWalletTopup(updateData), {
      loading: "กำลังบันทึก...",
      success: "บันทึกการตั้งค่าการเติมเงินผ่านธนาคารสำเร็จ",
      error: "บันทึกไม่สำเร็จ กรุณาลองใหม่",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 w-full bg-white border shadow p-4 rounded-2xl"
    >
      <h1 className="text-xl font-semibold text">
        ตั้งค่าการเติมเงินผ่านTrueMoney wallet
      </h1>

      <div className="flex items-center space-x-2">
        <Switch
          id="wallet-switch"
          checked={enabled}
          onCheckedChange={setEnabled}
          className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300"
        />
        <Label htmlFor="wallet-switch">
          {enabled ? (
            <Badge
              variant={"secondary"}
              className="bg-emerald-500 text-white transition-all ease-in-out duration-300"
            >
              เปิดใช้งาน
            </Badge>
          ) : (
            <Badge
              variant={"outline"}
              className="transition-all ease-in-out duration-300"
            >
              ปิดใช้งาน
            </Badge>
          )}
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="fee-switch"
          checked={feeEnabled}
          onCheckedChange={feeSetEnabled}
          className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300"
        />
        <Label htmlFor="fee-switch">
          {feeEnabled ? (
            <Badge
              variant={"secondary"}
              className="bg-emerald-500 text-white transition-all ease-in-out duration-300"
            >
              เก็บค่าธรรมเนียม
            </Badge>
          ) : (
            <Badge
              variant={"outline"}
              className="transition-all ease-in-out duration-300"
            >
              ไม่เก็บค่าธรรมเนียม
            </Badge>
          )}
        </Label>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="phone">เบอร์สำหรับรับเงิน</Label>
        <Input
          id="phone"
          name="phone"
          defaultValue={data.phone}
          placeholder="0957148911"
        />
      </div>

      <Badge className="text-xs">
        หลังจากตั้งค่าเสร็จแล้วอย่าลืมกด "บันทึกการแก้ไข"
      </Badge>

      <Button type="submit" className="btn-main">
        บันทึกการแก้ไข
      </Button>
    </form>
  );
}
