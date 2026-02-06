"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
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

import { AdminAppPremium } from "@/app/(admin)/admin/apppremium/columns";
import { useEffect } from "react";
import { updateAppPremiumProduct } from "@/lib/database/apppremium";

export function EditAppPremium({ product }: { product: AdminAppPremium }) {
  console.log(product);
  
  const [enabled, setEnabled] = useState(product.isDiscount);
  const [costPrice, setCostPrice] = useState<number>(
    Number(product.price) // fallback
  );

  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchCostPrice = async () => {
      try {
        const res = await fetch("https://byshop.me/api/product");
        const data = await res.json();

        // หา item ที่ id ตรงกัน
        const matched = data.find(
          (item: any) => String(item.id) === String(product.byshopId)
        );

        if (matched) {
          setCostPrice(Number(matched.price));
        }
      } catch (err) {
        console.error("โหลดราคาต้นทุนล้มเหลว", err);
      }
    };

    fetchCostPrice();
  }, [product.id]);

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const id = String(formData.get("id") || "");
    const price = Number(formData.get("price") || 0);
    const priceDiscount = Number(formData.get("priceDiscount") || 0);

    if (priceDiscount > price) {
      toast.error("ราคาหลังลดต้องไม่เกินราคาเดิม");
      return;
    }

    const updateData = {
      id,
      name: product.name,
      price: Number(price),
      priceDiscount: enabled ? Number(priceDiscount) : 0,
      isDiscount: enabled,
    };

    toast.promise(updateAppPremiumProduct(updateData), {
      loading: "กำลังบันทึก...",
      success: "บันทึกการแก้ไขสำเร็จ",
      error: "บันทึกไม่สำเร็จ กรุณาลองใหม่",
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <HugeiconsIcon icon={PencilEdit02Icon} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>แก้ไขสินค้า</DialogTitle>
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
                readOnly
              />
            </div>

            {/* ราคาต้นทุน */}
            <div className="space-y-2">
              <Label htmlFor="cost">ราคาต้นทุน</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                value={Math.floor(costPrice)}
                readOnly
              />
            </div>

            {/* ราคา */}
            <div className="space-y-2">
              <Label htmlFor="price">ราคาขาย</Label>
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
                  defaultValue={String(product.priceDiscount)}
                />
              </div>
            )}

            {/* Footer */}
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  ยกเลิก
                </Button>
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
