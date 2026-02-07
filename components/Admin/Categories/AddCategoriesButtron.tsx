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
import { createCategory } from "@/lib/database/category";
import { useState } from "react";

export function AddCategoriesButtron() {
  const [name,setName] = useState("")
  const [image,setImage] = useState("")
  const [open,setOpen] = useState(false)
  // 2. เปลี่ยนชื่อฟังก์ชัน
  async function handleAddProduct() {

    if (name === "" || !name || image === "" || !image) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    toast.promise(mustOk(createCategory({ id: "", name, image })), {
      loading: "กำลังบันทึก...",
      success: (r) => r.message,
      error: (e) => e.message,
    });

    setOpen(false)
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
          <span>เพิ่มหมวดหมู่</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {/* 6. อัปเดต Title และ Description */}
          <DialogTitle className="text">เพิ่มหมวดหมู่ใหม่</DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดเพื่อเพิ่มหมวดหมู่หม่ลงในระบบ
          </DialogDescription>
        </DialogHeader>

        {/* 7. อัปเดต action */}
        <form action={handleAddProduct} className="grid gap-4">
          {/* 8. ลบ hidden input "id" ที่ไม่จำเป็น */}

          <div className="grid gap-3">
            <Label htmlFor="name">ชื่อหมวดหมู่</Label>
            {/* 9. ลบ defaultValue และเพิ่ม placeholder */}
            <Input id="name" name="name" onChange={(e)=> setName(e.target.value)} />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="image">URL รูปภาพ</Label>
            <Input
              id="image"
              name="image"
              type="text"
              onChange={(e)=> setImage(e.target.value)}
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
              เพิ่มหมวดหมู่
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
