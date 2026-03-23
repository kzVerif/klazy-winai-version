"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { updateEtcButton } from "@/lib/database/etcButton";

export default function EtcForm({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);

  const handleChange = (index: number, key: string, value: string) => {
    setData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  };

  const handleSave = async () => {
    toast.promise(
      Promise.all(data.map((item) => updateEtcButton(item))),
      {
        loading: "กำลังบันทึกการตั้งค่า...",
        success: "บันทึกการตั้งค่าสำเร็จ",
        error: "เกิดข้อผิดพลาดในการบันทึก",
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item, index) => (
          <Card key={item.id}>
            <CardHeader>
              <h2 className="font-semibold">ปุ่มที่ {index + 1}</h2>
              <p className="text-sm text-muted-foreground">
                ตั้งค่ารูปภาพและลิงก์
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              <Input
                placeholder="ลิงก์รูปภาพ (.jpg .png)"
                value={item.image || ""}
                onChange={(e) =>
                  handleChange(index, "image", e.target.value)
                }
              />

              <Input
                placeholder="ลิงก์ปุ่ม"
                value={item.link || ""}
                onChange={(e) =>
                  handleChange(index, "link", e.target.value)
                }
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="btn-main">
          บันทึกการตั้งค่า
        </Button>
      </div>
    </div>
  );
}