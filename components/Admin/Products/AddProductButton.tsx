"use client";
import { mustOk } from "@/lib/mustOk";
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { createProducts } from "@/lib/database/shop";
import { Categories } from "@/lib/database/category";

export function AddProductButton({
  categories,
}: {
  categories: Categories[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [enabled, setEnabled] = useState(false);

  async function handleAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name") || "");
    const price = Number(formData.get("price") || 0);
    const image = String(formData.get("image") || "");
    const detail = String(formData.get("detail") || "");
    const priceDiscount = Number(formData.get("priceDiscount") || 0);

    if (enabled && priceDiscount >= price) {
      toast.error("ราคาที่ลดต้องน้อยกว่าราคาปกติ");
      return;
    }

    if (!selectedCategory) {
      toast.error("กรุณาเลือกหมวดหมู่สินค้า");
      return;
    }

    toast.promise(
     mustOk(createProducts({
        name,
        price,
        image,
        detail,
        categoriesId: selectedCategory,
        isDiscount: enabled,
        priceDiscount: enabled ? priceDiscount : 0,
      })),
      {
        loading: "กำลังสร้างสิน้คา...",
        success: (r) => r.message,
      error: (e) => e.message,
      }
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2 btn-main">
          <Plus className="h-4 w-4" />
          เพิ่มสินค้า
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text">เพิ่มสินค้าใหม่</DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดสินค้าเพื่อเพิ่มลงในระบบ
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] px-6">
          <form onSubmit={handleAddProduct} className="space-y-5 py-4">
            {/* ชื่อสินค้า */}
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อสินค้า</Label>
              <Input id="name" name="name" placeholder="Minecraft TFT" required />
            </div>

            {/* ราคา */}
            <div className="space-y-2">
              <Label htmlFor="price">ราคา</Label>
              <Input id="price" name="price" type="number" placeholder="0.00" required />
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

            {/* รูป */}
            <div className="space-y-2">
              <Label htmlFor="image">URL รูปภาพ</Label>
              <Input id="image" name="image" placeholder="https://..." required />
            </div>

            {/* รายละเอียด */}
            <div className="space-y-2">
              <Label htmlFor="detail">รายละเอียดสินค้า</Label>
              <Textarea
                id="detail"
                name="detail"
                rows={5}
                placeholder="อธิบายรายละเอียดสินค้า..."
                className="resize-none"
                required
              />
            </div>

            {/* หมวดหมู่ */}
            <div className="space-y-2">
              <Label>หมวดหมู่</Label>
              <Select onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่สินค้า" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline">ยกเลิก</Button>
              </DialogClose>
              <Button type="submit" className="btn-main">
                เพิ่มสินค้า
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
