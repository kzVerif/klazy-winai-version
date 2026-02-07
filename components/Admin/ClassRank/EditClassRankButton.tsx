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
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { updateClassRank } from "@/lib/database/Class";

export function EditClassRankButton({ rank }: { rank: any }) {
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState(rank.className);
  const [upgrade, setUpgrade] = useState(rank.upgrade);
  const [isPercent, setIsPercent] = useState(rank.isPercent);
  const [reward, setReward] = useState(rank.reward);
async function handleAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 1. Validation Logic
    if (!className.trim()) {
      return toast.error("กรุณาตั้งชื่อคลาสก่อน");
    }
    if (Number(upgrade) < 0) {
      return toast.error("กรุณากรอกเกณฑ์ในการอัปเกรดที่มากกว่า 0");
    }
    
    const rewardNum = Number(reward);
    if (isPercent) {
      if (rewardNum > 100) {
        return toast.error("ส่วนลดแบบเปอร์เซ็นต์ไม่สามารถเกิน 100% ได้");
      }
      if (rewardNum < 0) {
        return toast.error("ส่วนลดไม่สามารถมีค่าติดลบได้");
      }
    }

    // 2. Prepare Data (Force Number conversion)
    const data = {
      id: rank.id,
      className: className.trim(),
      upgrade: Number(upgrade),
      isPercent,
      reward: rewardNum,
    };
    
      await toast.promise(mustOk(updateClassRank(data)), {
        loading: "กำลังแก้ไขคลาส...",
        success: (r) => r.message,
        error: (e) => e.message,
      });
      
      // ปิด Modal เมื่อสำเร็จเท่านั้น (หรือจะปิดเลยก็ได้ตาม UX ที่ต้องการ)
      setOpen(false);
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
            <p>แก้ไขคลาส</p>
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
        <form onSubmit={handleAddProduct} className="grid gap-4">
          {/* 8. ลบ hidden input "id" ที่ไม่จำเป็น */}

          <div className="gap-3 grid">
            <Label htmlFor="name">ชื่อคลาส</Label>
            <Input
              id="name"
              name="name"
              placeholder="เสี่ยเลเวล1"
              type="text"
              defaultValue={className}
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
              defaultValue={upgrade}
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
              defaultValue={reward}
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
              แก้ไขคลาส
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
