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
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { addClassRank } from "@/lib/database/Class";

export function AddClassRankButton() {
  const [className, setClassName] = useState("");
  const [upgrade, setUpgrade] = useState(0);
  const [isPercent, setIsPercent] = useState(false);
  const [reward, setReward] = useState(0);
  const [open, setOpen] = useState(false);
  // 2. เปลี่ยนชื่อฟังก์ชัน
async function handleAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 1. Validation เบื้องต้น
    if (!className || className.trim() === "") {
      return toast.error("กรุณาตั้งชื่อคลาสก่อน");
    }
    
    // แปลงค่าเป็นตัวเลขก่อนตรวจสอบ
    const upgradeNum = Number(upgrade);
    const rewardNum = Number(reward);

    if (upgradeNum < 0) {
      return toast.error("กรุณากรอกเกณฑ์ในการอัปเกรดที่มากกว่า 0");
    }

    // 2. Validation Logic สำหรับ Percent
    if (isPercent) {
      if (rewardNum > 100) {
        return toast.error("ส่วนลดแบบเปอร์เซ็นต์ไม่สามารถเกิน 100% ได้");
      }
      if (rewardNum < 0) {
        return toast.error("ส่วนลดไม่สามารถมีค่าติดลบได้");
      }
    }

    // 3. เตรียม Data ให้ตรงกับ Prisma Schema
    const data = {
      className,
      upgrade: upgradeNum, // ส่งค่าที่เป็น Number
      isPercent,
      reward: rewardNum,   // ส่งค่าที่เป็น Number
    };

    // 4. ใช้ Try-Catch หรือ Await เพื่อจัดการ UX
      await toast.promise(addClassRank(data), {
        loading: "กำลังสร้างคลาสใหม่...",
        success: "สร้างคลาสสำเร็จ",
        error: (err) => `เกิดข้อผิดพลาด: ${err.message}`, // แสดง Error จริงถ้ามี
      });

      // ปิด Modal เมื่อสำเร็จเท่านั้น
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
          <span>เพิ่มคลาสใหม่</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {/* 6. อัปเดต Title และ Description */}
          <DialogTitle className="text">เพิ่มคลาสใหม่</DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดเพื่อเพิ่มคลาสใหม่ลงในระบบ
          </DialogDescription>
        </DialogHeader>

        {/* 7. อัปเดต action */}
        <form onSubmit={handleAddProduct} className="grid gap-4">
          {/* 8. ลบ hidden input "id" ที่ไม่จำเป็น */}

          <div className="gap-3 grid">
            <Label htmlFor="name">ชื่อคลาส</Label>
            <Input
              id="name"
              name="name"
              placeholder="เสี่ยเลเวล1"
              type="text"
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
          <div className="gap-3 grid">
            <Label htmlFor="name">เกณฑ์ในการอัปเกรด</Label>
            <Input
              id="name"
              name="name"
              placeholder="อ้างอิงตามยอดเติมสะสม"
              type="number"
              onChange={(e) => setUpgrade(Number(e.target.value))}
            />
          </div>

          <div className="gap-3 grid">
            <Label htmlFor="name">ส่วนลดที่ได้รับ</Label>
            {/* 9. ลบ defaultValue และเพิ่ม placeholder */}
            <Input
              id="name"
              name="name"
              placeholder="100"
              type="number"
              onChange={(e) => setReward(Number(e.target.value))}
            />
          </div>

          <div className="flex gap-3">
            <Switch
              id="wallet-switch"
              checked={isPercent}
              onCheckedChange={setIsPercent}
              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300"
            />
            <Label htmlFor="wallet-switch">
              {isPercent ? (
                <Badge
                  variant={"secondary"}
                  className="bg-emerald-500 text-white transition-all ease-in-out duration-300"
                >
                  ลดแบบเปอร์เซ็นต์
                </Badge>
              ) : (
                <Badge
                  variant={"outline"}
                  className="transition-all ease-in-out duration-300"
                >
                  ลดแบบค่าคงที่
                </Badge>
              )}
            </Label>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                ยกเลิก
              </Button>
            </DialogClose>

            {/* 13. อัปเดตข้อความปุ่ม Submit */}
            <Button type="submit" className="btn-main">
              เพิ่มคลาสใหม่
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
