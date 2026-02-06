"use client";
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
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createOrderProduct } from "@/lib/database/orders";
import { useState } from "react";

export function AddOrdersProduct() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [detail, setDetail] = useState("");
  // 2. เปลี่ยนชื่อฟังก์ชัน
  async function handleAddProduct() {
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
      name,
      detail,
      image,
    };

    toast.promise(createOrderProduct(data), {
      loading: "กำลังบันทึก...",
      success: "บันทึกการสินค้าประเภทออเดอร์ใหม่สำเร็จ",
      error: "บันทึกไม่สำเร็จ กรุณาลองใหม่",
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* 5. อัปเดตปุ่ม Trigger */}
        <Button
          variant="secondary"
          className="cursor-pointer flex items-center gap-2 btn-main"
        >
          <Plus className="h-4 w-4" />
          <span>เพิ่มสินค้าประเภทออเดอร์</span>
        </Button>
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

          <div className="grid gap-3">
            <Label htmlFor="name">ชื่อสินค้าประเภทออเดอร์</Label>
            {/* 9. ลบ defaultValue และเพิ่ม placeholder */}
            <Input
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
            />
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
                onChange={(e) => setDetail(e.target.value)}
              />
            </ScrollArea>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="image">URL รูปภาพ</Label>
            <Input
              id="image"
              name="image"
              type="text"
              onChange={(e) => setImage(e.target.value)}
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
              เพิ่มสินค้าประเภทออเดอร์
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
