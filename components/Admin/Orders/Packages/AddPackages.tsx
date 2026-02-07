"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

import { createOrderPackage } from "@/lib/database/OrderPackages";

export function AddPackages({id}: {id: string}) {
  const [enabled, setEnabled] = useState(false);

  async function handleAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name") || "");
    const price = Number(formData.get("price") || 0);
    const priceDiscount = Number(formData.get("priceDiscount") || 0);

    if (name === "" || !name) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (enabled && priceDiscount >= price) {
      toast.error("ราคาที่ลดต้องน้อยกว่าราคาปกติ");
      return;
    }

    const data = {
      name,
      price,
      priceDiscount,
      isDiscount: enabled,
      orderProductId: id
    };

    toast.promise(mustOk(createOrderPackage(data)), {
      loading: "กำลังสร้างแพ็คเกจใหม่...",
      success: (r) => r.message,
      error: (e) => e.message,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="flex items-center gap-2 btn-main"
        >
          <Plus className="h-4 w-4" />
          เพิ่มแพ็คเกจ
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text">เพิ่มสินค้าแพ็คเกจใหม่</DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดแพ็คเกจเพื่อเพิ่มลงในระบบ
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] px-6">
          <form onSubmit={handleAddProduct} className="space-y-5 py-4">
            {/* ชื่อสินค้า */}
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อแพ็คเกจ</Label>
              <Input
                id="name"
                name="name"
                placeholder="Minecraft TFT"
                required
              />
            </div>

            {/* ราคา */}
            <div className="space-y-2">
              <Label htmlFor="price">ราคา</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="0.00"
                required
              />
            </div>

            {/* ลดราคา */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-1">
                <Label>เปิดการลดราคา</Label>
                <p className="text-xs text-muted-foreground">
                  กำหนดราคาพิเศษสำหรับสินค้า
                </p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={setEnabled}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            {/* ราคาหลังลด */}
            {enabled && (
              <div className="space-y-2">
                <Label htmlFor="priceDiscount">ราคาหลังลด</Label>
                <Input
                  id="priceDiscount"
                  name="priceDiscount"
                  type="number"
                  placeholder="0.00"
                  required
                />
              </div>
            )}

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline">ยกเลิก</Button>
              </DialogClose>
              <Button type="submit" className="btn-main">
                เพิ่มแพ็คเกจ
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
