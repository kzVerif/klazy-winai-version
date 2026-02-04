"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { updateStatusAppremium } from "@/lib/database/apppremium";
import { Input } from "@/components/ui/input";

export default function AppPremiumSetting({ data }: { data: any }) {
  const [enabled, setEnabled] = useState(data.status);
  const [isSuggest, setIsSuggest] = useState(data.isSuggest);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const key = (e.currentTarget.elements.namedItem("key") as HTMLInputElement)
      .value;
    const image = (
      e.currentTarget.elements.namedItem("image") as HTMLInputElement
    ).value;

    const updateData = {
      id: data.id,
      status: enabled,
      key,
      image,
      isSuggest,
    };

    toast.promise(updateStatusAppremium(updateData), {
      loading: "กำลังบันทึก...",
      success: "บันทึกการตั้งค่าการขายแอปพรีเมียมสำเร็จ",
      error: "บันทึกไม่สำเร็จ กรุณาลองใหม่",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 w-full bg-white border shadow p-4 rounded-2xl"
    >
      <h1 className="text-xl font-semibold text">สินค้าแอปพรีเมียม</h1>

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
          id="isSuggest-switch"
          checked={isSuggest}
          onCheckedChange={setIsSuggest}
          className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300"
        />
        <Label htmlFor="isSuggest-switch">
          {isSuggest ? (
            <Badge
              variant={"secondary"}
              className="bg-emerald-500 text-white transition-all ease-in-out duration-300"
            >
              เปิดการแนะนำสินค้าแอปพรีเมี่ยม
            </Badge>
          ) : (
            <Badge
              variant={"outline"}
              className="transition-all ease-in-out duration-300"
            >
              ปิดการแนะนำสินค้าแอปพรีเมี่ยม
            </Badge>
          )}
        </Label>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="key">คีย์ API จาก ByShop</Label>
        <Input
          id="key"
          name="key"
          defaultValue={data.key}
          placeholder="FGLAQh..........."
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="image">รูปภาพหมวดหมู่แอปพรีเมียม</Label>
        <Input
          id="image"
          name="image"
          defaultValue={data.image}
          placeholder="ขนาด 1980 x 500 px"
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
