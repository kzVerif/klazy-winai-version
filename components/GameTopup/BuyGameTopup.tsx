"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InspectCodeIcon,
} from "@hugeicons/core-free-icons";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";

interface BuyGameTopupProps {
  uid: string;
  name: string
  price: number;
}

export default function BuyGameTopup({ uid, price, name }: BuyGameTopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [total, setTotal] = useState(price);
  const { data: session } = useSession();

  const handleApplyCode = (e: React.FormEvent<HTMLFormElement>) => {

    setTotal(price)
    e.preventDefault();
    if (!uid) {
        toast.error("กรุณากรอก uid");
      return;
    }

    if (code !== "winaicodehode") {
      toast.error("ไม่พบโค้ดในระบบ");
      return;
    }
    setTotal((prev) => prev * 0.9); // ลด 10%
    toast.success("คุณได้รับส่วนลด 10%");
  };

  const handleBuy = async () => {
    if (!session) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    try {
      setIsOpen(false);
      toast.loading("กำลังสั่งซื้อสินค้า...");
      // Call API buyProducts(productId, quantity, total) ถ้ามี
      toast.dismiss();
      toast.success("สั่งซื้อสินค้าสำเร็จ กรุณาตรวจสอบประวัติการสั่งซื้อ");
    } catch (err) {
      console.error(err);
      setIsOpen(false);
    }
  };

  return (
    <div>
        
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button
            variant={"default"}
            className={`w-full sm:w-auto text-lg px-6 py-3 rounded-xl flex items-center justify-center gap-2 btn-main`}
          >
            <ShoppingCart size={22} /> สั่งซื้อสินค้า
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>ยืนยันการสั่งซื้อ</DialogTitle>
            <DialogDescription>
              คุณต้องการซื้อสินค้า {name} ในราคา {total.toFixed(2)}฿
              ใช่หรือไม่
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyCode} className="space-y-4">
            <div>
              <Label htmlFor="code">โค้ดส่วนลด</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="กรอกโค้ดส่วนลดของคุณ"
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full" variant="outline">
              <HugeiconsIcon icon={InspectCodeIcon} /> ตรวจสอบโค้ด
            </Button>
          </form>

          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">ยกเลิก</Button>
            </DialogClose>

            <Button onClick={handleBuy}>ยืนยัน</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
