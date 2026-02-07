"use client";
import { mustOk } from "@/lib/mustOk";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

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

import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";

// ✅ เปลี่ยนเป็น update
import { updateDiscountCode } from "@/lib/database/DiscountCode";

function toDatetimeLocalValue(dateLike: any) {
  const d = dateLike ? new Date(dateLike) : null;
  if (!d || Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

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

export default function EditDiscountCodeButton({ code }: { code: any }) {
  const [open, setOpen] = useState(false);

  // ✅ Controlled states (ผูกกับ code)
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [reward, setReward] = useState<number>(0);
  const [maxUse, setMaxUse] = useState<number>(0);
  const [expired, setExpired] = useState<string>("");

  const [duplicateUse, setDuplicateUse] = useState(false);
  const [isPercent, setIsPercent] = useState(false);

  const [normalProduct, setNormalProduct] = useState(true);
  const [appPremium, setAppPremium] = useState(false);
  const [orderProduct, setOrderProduct] = useState(false);

  // ✅ เวลาเปิด dialog ให้โหลดค่าเดิมเข้า state
  useEffect(() => {
    if (!open) return;

    setName(code?.name ?? "");
    setKey(code?.key ?? "");
    setReward(Number(code?.reward ?? 0));
    setMaxUse(Number(code?.maxUse ?? 0));
    setExpired(toDatetimeLocalValue(code?.expired));

    setDuplicateUse(Boolean(code?.canDuplicateUse));
    setIsPercent(Boolean(code?.isPercent));

    setNormalProduct(Boolean(code?.normalProduct));
    setAppPremium(Boolean(code?.appPremiumProduct));
    setOrderProduct(Boolean(code?.orderProduct));
  }, [open, code]);

  const rewardLabel = useMemo(
    () => (isPercent ? "เปอร์เซ็นต์ส่วนลด (%)" : "จำนวนลดตรง ๆ"),
    [isPercent],
  );

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const rewardRaw = Number(reward);

    if (
      isPercent &&
      (Number.isNaN(rewardRaw) || rewardRaw <= 0 || rewardRaw > 100)
    ) {
      toast.error("เปอร์เซ็นต์ส่วนลดต้องอยู่ระหว่าง 1 - 100");
      return;
    }

    const payload = {
      id: code.id,
      name: name.trim(),
      key: key.trim(),
      reward: rewardRaw,
      isPercent,

      maxUse: Number(maxUse),
      expired: new Date(expired),

      canDuplicateUse: duplicateUse,
      normalProduct,
      appPremiumProduct: appPremium,
      orderProduct,
    };

    toast.promise(mustOk(updateDiscountCode(payload)),{
      loading: "กำลังบันทึกการแก้ไข...",
      success: (r) => r.message,
      error: (e) => e.message,
    })
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <HugeiconsIcon icon={PencilEdit02Icon} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text">แก้ไขโค้ดส่วนลด</DialogTitle>
          <DialogDescription>
            แก้ไขรายละเอียดโค้ดส่วนลด แล้วกดบันทึกการแก้ไข
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] px-6 pb-6">
          <form onSubmit={handleUpdate} className="grid gap-5">
            <div className="grid gap-3">
              <Label htmlFor="name">ชื่อโค้ด</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="key">รหัสโค้ด</Label>
              <Input
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                แนะนำ: หากระบบบังคับ unique key แล้วเปลี่ยน key อาจชนของเดิมได้
              </p>
            </div>

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
                    : "ปิดอยู่: ช่องด้านล่างจะเป็น “จำนวนลดแบบตรง ๆ”"
                }
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="reward">{rewardLabel}</Label>
              <Input
                id="reward"
                type="number"
                value={Number.isNaN(reward) ? "" : reward}
                onChange={(e) => setReward(Number(e.target.value))}
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
              <Input
                id="maxUse"
                type="number"
                value={Number.isNaN(maxUse) ? "" : maxUse}
                onChange={(e) => setMaxUse(Number(e.target.value))}
                required
              />
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
              <Input
                id="expired"
                type="datetime-local"
                value={expired}
                onChange={(e) => setExpired(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="sticky bottom-0 bg-background pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
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
