"use client";
import { mustOk } from "@/lib/mustOk";
import { useState } from "react";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";

import { Products } from "@/app/(admin)/admin/products/columns";
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

import { updateProduct } from "@/lib/database/shop";

export function EditProductButton({ product }: { product: Products }) {  
  const [selectedCategory, setSelectedCategory] = useState(
    product.category.id
  );
  const [enabled, setEnabled] = useState(product.isDiscount);
  console.log(enabled);
  

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "");
    const price = Number(formData.get("price") || 0);
    const image = String(formData.get("image") || "");
    const detail = String(formData.get("detail") || "");
    const priceDiscount = Number(formData.get("priceDiscount") || 0);

    if (priceDiscount > price) {
      toast.error("ราคาหลังลดต้องไม่เกินราคาเดิม");
      return;
    }

    if (!selectedCategory) {
      toast.error("กรุณาเลือกหมวดหมู่สินค้า");
      return;
    }

    toast.promise(
     mustOk(updateProduct({
        id,
        name,
        price,
        image,
        detail,
        categoriesId: selectedCategory,
        isDiscount: enabled,
        priceDiscount: enabled ? priceDiscount : 0,
      })),
      {
        loading: "กำลังแก้ไขสินค้า...",
        success: (r) => r.message,
      error: (e) => e.message,
      }
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <HugeiconsIcon icon={PencilEdit02Icon} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text">แก้ไขสินค้า</DialogTitle>
          <DialogDescription>
            เปลี่ยนแปลงรายละเอียดของสินค้าชิ้นนี้
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <ScrollArea className="max-h-[70vh] px-6">
          <form onSubmit={handleEdit} className="space-y-5 py-4">
            <input type="hidden" name="id" defaultValue={product.id} />

            {/* ชื่อสินค้า */}
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อสินค้า</Label>
              <Input
                id="name"
                name="name"
                defaultValue={product.name}
              />
            </div>

            {/* ราคา */}
            <div className="space-y-2">
              <Label htmlFor="price">ราคา</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                step={1}
                defaultValue={Math.floor(Number(product.price))}
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
                  min={0}
                  required
                  defaultValue={product.priceDiscount}
                />
              </div>
            )}

            {/* รูป */}
            <div className="space-y-2">
              <Label htmlFor="image">URL รูปภาพ</Label>
              <Input
                id="image"
                name="image"
                defaultValue={product.image ?? ""}
                placeholder="https://..."
              />
            </div>

            {/* รายละเอียด */}
            <div className="space-y-2">
              <Label htmlFor="detail">รายละเอียดสินค้า</Label>
              <Textarea
                id="detail"
                name="detail"
                defaultValue={product.detail ?? ""}
                rows={5}
                className="resize-none"
              />
            </div>

            {/* หมวดหมู่ */}
            <div className="space-y-2">
              <Label>หมวดหมู่</Label>
              <Select
                defaultValue={product.category.id}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่สินค้า" />
                </SelectTrigger>
                <SelectContent>
                  {product.allCategories.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Footer */}
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline">ยกเลิก</Button>
              </DialogClose>
              <Button type="submit" className="btn-main">
                บันทึกการแก้ไข
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
