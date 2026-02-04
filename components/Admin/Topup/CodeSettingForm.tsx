"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { updateTopupCode } from "@/lib/database/topupcode";

export default function CodeSettinngForm({ data }: { data: any }) {
  const [enabled, setEnabled] = useState(data);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updateData = {
      available: enabled,
    };

    toast.promise(updateTopupCode(updateData), {
      loading: "กำลังบันทึก...",
      success: "บันทึกการตั้งค่าการเติมเงินผ่านโค้ดสำเร็จ",
      error: "บันทึกไม่สำเร็จ กรุณาลองใหม่",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 w-full bg-white border shadow p-4 rounded-2xl"
    >
      <h1 className="text-xl font-semibold text">
        ตั้งค่าการเติมเงินผ่านโค้ด
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

      <Badge className="text-xs">
        หลังจากตั้งค่าเสร็จแล้วอย่าลืมกด "บันทึกการแก้ไข"
      </Badge>

      <Button type="submit" className="btn-main">
        บันทึกการแก้ไข
      </Button>
    </form>
  );
}
