"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createDiscountCode } from "@/lib/database/DiscountCode";

function ToggleRow({
  label,
  id,
  checked,
  onCheckedChange,
  onText = "เปิด",
  offText = "ปิด",
  description,
}: {
  label: string;
  id: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  onText?: string;
  offText?: string;
  description?: string;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <Label htmlFor={id}>{label}</Label>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300"
          />
          {checked ? (
            <Badge className="bg-emerald-500 text-white">{onText}</Badge>
          ) : (
            <Badge variant="outline">{offText}</Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AddDiscountCodeButton() {
  const [duplicateUse, setDuplicateUse] = useState(false);

  // ✅ ใหม่: โหมดลดแบบเปอร์เซ็นต์
  const [isPercent, setIsPercent] = useState(false);

  const [normalProduct, setNormalProduct] = useState(true);
  const [appPremium, setAppPremium] = useState(false);
  const [orderProduct, setOrderProduct] = useState(false);
  const [open, setOpen] = useState(false);



  async function handleAddCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const rewardRaw = Number(formData.get("reward"));

    // (option) ถ้าเป็นเปอร์เซ็นต์ บังคับช่วง 1-100
    if (isPercent && (Number.isNaN(rewardRaw) || rewardRaw <= 0 || rewardRaw > 100)) {
      toast.error("เปอร์เซ็นต์ส่วนลดต้องอยู่ระหว่าง 1 - 100");
      return;
    }

    setOpen(false)

    const data = {
      name: String(formData.get("name") || "").trim(),
      key: String(formData.get("key") || "").trim(),
      // ✅ reward จะหมายถึง "เปอร์เซ็นต์" ถ้า isPercent=true
      reward: rewardRaw,
      isPercent,
      maxUse: Number(formData.get("maxUse")),
      expired: new Date(String(formData.get("expired"))),
      canDuplicateUse: duplicateUse,
      normalProduct,
      appPremiumProduct: appPremium,
      orderProduct,
    };

    toast.promise(mustOk(createDiscountCode(data)), {
      loading: "กำลังสร้างโค้ดใหม่...",
      success: (r) => r.message,
      error: (e) => e.message,
    })
    
    form.reset();

    setDuplicateUse(false);
    setIsPercent(false);
    setNormalProduct(true);
    setAppPremium(false);
    setOrderProduct(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2 btn-main">
          <Plus className="h-4 w-4" />
          <span>เพิ่มโค้ดส่วนลดใหม่</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text">เพิ่มโค้ดส่วนลดใหม่</DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดเพื่อเพิ่มโค้ดใหม่ลงในระบบ
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] px-6 pb-6">
          <form onSubmit={handleAddCode} className="grid gap-5">
            <div className="grid gap-3">
              <Label htmlFor="name">ชื่อโค้ด</Label>
              <Input id="name" name="name" required />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="key">รหัสโค้ด</Label>
              <Input id="key" name="key" required />
            </div>

            {/* ✅ ใหม่: สวิตช์เลือก Percent */}
            <div className="rounded-md border p-3">
              <ToggleRow
                label="ลดแบบเปอร์เซ็นต์ (Percent)"
                id="is-percent"
                checked={isPercent}
                onCheckedChange={setIsPercent}
                onText="ลดเป็น %"
                offText="ลดตรง ๆ"
                description={
                  isPercent
                    ? "เปิดอยู่: ช่องด้านล่างจะเป็น “เปอร์เซ็นต์ส่วนลด” เช่น 10 = ลด 10%"
                    : "ปิดอยู่: ช่องด้านล่างจะเป็น “จำนวนลดตรง ๆ” (ตามหน่วยที่ระบบคุณกำหนด)"
                }
              />
            </div>

            {/* ✅ reward เปลี่ยนตามโหมด */}
            <div className="grid gap-3">
              <Label htmlFor="reward">
                {isPercent ? "เปอร์เซ็นต์ส่วนลด (%)" : "จำนวนลดตรง ๆ"}
              </Label>

              <Input
                id="reward"
                name="reward"
                type="number"
                required
                min={isPercent ? 1 : undefined}
                max={isPercent ? 100 : undefined}
                placeholder={isPercent ? "เช่น 10 = ลด 10%" : "เช่น 50"}
              />

              <p className="text-xs text-muted-foreground">
                {isPercent
                  ? "เมื่อเปิดแบบเปอร์เซ็นต์ ระบบจะนำค่าในช่องนี้ไปคิดเป็น % ของราคาสินค้า"
                  : "เมื่อปิดแบบเปอร์เซ็นต์ ระบบจะใช้ค่าช่องนี้เป็นจำนวนลดแบบตรง ๆ"}
              </p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="maxUse">จำนวนการใช้งานสูงสุด</Label>
              <Input id="maxUse" name="maxUse" type="number" required />
            </div>

            <div className="rounded-md border p-3">
              <ToggleRow
                label="การใช้ซ้ำ"
                id="duplicate-use"
                checked={duplicateUse}
                onCheckedChange={setDuplicateUse}
                onText="ใช้ซ้ำได้"
                offText="ใช้ซ้ำไม่ได้"
              />
            </div>

            <div className="grid gap-3">
              <div className="text-sm font-medium">ใช้ได้กับสินค้า</div>
              <div className="grid gap-3">
                <div className="rounded-md border p-3">
                  <ToggleRow
                    label="สินค้าทั่วไป"
                    id="normal-product"
                    checked={normalProduct}
                    onCheckedChange={setNormalProduct}
                    onText="ใช้ได้"
                    offText="ใช้ไม่ได้"
                  />
                </div>

                <div className="rounded-md border p-3">
                  <ToggleRow
                    label="สินค้าแอปพรีเมี่ยม"
                    id="app-premium"
                    checked={appPremium}
                    onCheckedChange={setAppPremium}
                    onText="ใช้ได้"
                    offText="ใช้ไม่ได้"
                  />
                </div>

                <div className="rounded-md border p-3">
                  <ToggleRow
                    label="สินค้าพรีออเดอร์"
                    id="order-product"
                    checked={orderProduct}
                    onCheckedChange={setOrderProduct}
                    onText="ใช้ได้"
                    offText="ใช้ไม่ได้"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="expired">วันหมดอายุ</Label>
              <Input id="expired" name="expired" type="datetime-local" required />
            </div>

            <DialogFooter className="sticky bottom-0 bg-background pt-2">
              <DialogClose asChild>
                <Button variant="outline">ยกเลิก</Button>
              </DialogClose>
              <Button type="submit" className="btn-main">
                เพิ่มโค้ดใหม่
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
