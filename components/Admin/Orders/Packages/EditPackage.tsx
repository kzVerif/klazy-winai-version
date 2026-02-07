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

import {
  createOrderPackage,
  updateOrderPackageById,
} from "@/lib/database/OrderPackages";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";

export function EditPackages({ Orderpackage }: { Orderpackage: any }) {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(Orderpackage.isDiscount);

  async function handleAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const id = String(formData.get("id") || "");
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
      id: id,
    };

    toast.promise(mustOk(updateOrderPackageById(data)), {
      loading: "กำลังแก้ไขแพ็คเกจ...",
      success: "แก้ไข Packages สำเร็จ",
      error: "ไม่สามารถแก้ไข Packages ได้ ลองใหม่อีกครั้ง",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="cursor-pointer flex items-center gap-2 "
              onClick={() => setOpen(true)}
            >
              <HugeiconsIcon icon={PencilEdit02Icon} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>แก้ไขแพ็คเกจ</p>
          </TooltipContent>
        </Tooltip>
        {/* 5. อัปเดตปุ่ม Trigger */}
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
            <Input
              id="id"
              name="id"
              placeholder="Minecraft TFT"
              defaultValue={Orderpackage.id}
              className="hidden"
            />
            {/* ชื่อสินค้า */}
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อแพ็คเกจ</Label>
              <Input
                id="name"
                name="name"
                placeholder="Minecraft TFT"
                defaultValue={Orderpackage.name}
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
                defaultValue={Orderpackage.price}
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
                  defaultValue={Orderpackage.priceDiscount}
                />
              </div>
            )}

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline">ยกเลิก</Button>
              </DialogClose>
              <Button type="submit" className="btn-main">
                แก้ไขแพ็คเกจ
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
