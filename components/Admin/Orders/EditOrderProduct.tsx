"use client";
import { mustOk } from "@/lib/mustOk";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogDescription } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
// 1. เปลี่ยนมาใช้ไอคอนจาก lucide-react
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateOrderProduct } from "@/lib/database/orders";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function EditOrderProduct({ order }: { order: any }) {
  const [open, setOpen] = useState(false);
  // 2. เปลี่ยนชื่อฟังก์ชัน
  async function handleAddProduct(formData: FormData) {
    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "");
    const detail = String(formData.get("detail") || "");
    const image = String(formData.get("image") || "");

    if (
      name === "" ||
      !name ||
      detail === "" ||
      !detail ||
      image === "" ||
      !image
    ) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const data = {
      id,
      name,
      detail,
      image,
    };

    setOpen(false);

    toast.promise(mustOk(updateOrderProduct(data)), {
      loading: "กำลังบันทึกสินค้าพรีออเดอร์...",
      success: (r) => r.message,
      error: (e) => e.message,
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
              onClick={()=> setOpen(true)}
            >
              <HugeiconsIcon icon={PencilEdit02Icon} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>แก้ไขสินค้า</p>
          </TooltipContent>
        </Tooltip>
        {/* 5. อัปเดตปุ่ม Trigger */}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {/* 6. อัปเดต Title และ Description */}
          <DialogTitle className="text">
            เพิ่มสินค้าประเภทออเดอร์ใหม่
          </DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดเพื่อเพิ่มสินค้าประเภทออเดอร์ลงในระบบ
          </DialogDescription>
        </DialogHeader>

        {/* 7. อัปเดต action */}
        <form action={handleAddProduct} className="grid gap-4">
          {/* 8. ลบ hidden input "id" ที่ไม่จำเป็น */}

          <Input id="id" name="id" defaultValue={order.id} className="hidden" />

          <div className="grid gap-3">
            <Label htmlFor="name">ชื่อสินค้าประเภทออเดอร์</Label>
            {/* 9. ลบ defaultValue และเพิ่ม placeholder */}
            <Input id="name" name="name" defaultValue={order.name} />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="detail"
              className="text-sm font-medium text-muted-foreground"
            >
              รายละเอียดสินค้า
            </Label>

            <ScrollArea className="h-36 w-full rounded-lg border bg-background">
              <Textarea
                id="detail"
                name="detail"
                placeholder="กรอกรายละเอียดสินค้า เช่น วิธีใช้งาน เงื่อนไข หรือหมายเหตุเพิ่มเติม"
                className="
        min-h-[140px]
        resize-none
        border-0
        bg-transparent
        focus-visible:ring-0
        focus-visible:ring-offset-0
        text-sm
      "
                defaultValue={order.detail}
              />
            </ScrollArea>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="image">URL รูปภาพ</Label>
            <Input
              id="image"
              name="image"
              type="text"
              defaultValue={order.image}
              // 11. ลบ defaultValue
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                ยกเลิก
              </Button>
            </DialogClose>

            {/* 13. อัปเดตข้อความปุ่ม Submit */}
            <Button type="submit" className="btn-main">
              แก้ไขสินค้าออเดอร์
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
