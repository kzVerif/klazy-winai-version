"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InspectCodeIcon,
  Wallet01Icon,
  PackageIcon,
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
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { getUserById } from "@/lib/database/users";
import { useUser } from "@/contexts/UserContext";
import { BuyAppPremium } from "@/lib/database/apppremium";
import { ScrollArea } from "../ui/scroll-area";
import { checkDiscountcode } from "@/lib/database/DiscountCode";

interface BuyFormProps {
  remain: number;
  productId: string;
  price: number;
  isDiscount: boolean;
  priceDiscount: number;
  feeAvailable: boolean;
  byshopId: string;
}

export default function BuyApp({
  remain,
  productId,
  price,
  isDiscount,
  priceDiscount,
  feeAvailable,
  byshopId,
}: BuyFormProps) {
  const { refreshUser } = useUser();
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  // โค้ดส่วนลด
  const [code, setCode] = useState("");
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<null | {
    key: string;
    percent?: number;
    amount?: number;
  }>(null);
  const { data: session, update } = useSession();

  const priceNum = Number(price) || 0;

  // ✅ ยอดสินค้า (ก่อนค่าธรรมเนียม)
  const baseTotal = useMemo(() => {
    const base = isDiscount ? Number(priceDiscount) : priceNum;
    return base * quantity;
  }, [isDiscount, priceDiscount, priceNum, quantity]);

  // ✅ ค่าธรรมเนียม (ยังใช้คำนวณยอดเติมเงินด้านนอก dialog ได้ตามเดิม)
  const fee = useMemo(() => {
    if (!feeAvailable) return 0;
    return Math.min(baseTotal * 0.029, 20);
  }, [feeAvailable, baseTotal]);

  // ✅ ยอดเติมเงิน (แสดงด้านนอก dialog ได้ตามเดิม)
  const finalTotal = useMemo(() => baseTotal + fee, [baseTotal, fee]);

  // ✅ ยอดสินค้า หลังส่วนลด (ใช้ใน Dialog)
  const discountedBaseTotal = useMemo(() => {
    if (!discountInfo) return baseTotal;

    if (discountInfo.percent) {
      const cut = baseTotal * (discountInfo.percent / 100);
      return Math.max(0, Math.round((baseTotal - cut) * 100) / 100);
    }

    if (discountInfo.amount) {
      return Math.max(
        0,
        Math.round((baseTotal - discountInfo.amount) * 100) / 100,
      );
    }

    return baseTotal;
  }, [baseTotal, discountInfo]);

  // ✅ ยอด “ส่งให้ backend” (ยังคง logic เดิม: รวมค่าธรรมเนียมด้วย ถ้าคุณใช้แบบนี้อยู่)
  const discountedTotal = useMemo(() => {
    if (!discountInfo) return finalTotal;

    if (discountInfo.percent) {
      const cut = finalTotal * (discountInfo.percent / 100);
      return Math.max(0, Math.round((finalTotal - cut) * 100) / 100);
    }

    if (discountInfo.amount) {
      return Math.max(
        0,
        Math.round((finalTotal - discountInfo.amount) * 100) / 100,
      );
    }

    return finalTotal;
  }, [finalTotal, discountInfo]);

  useEffect(() => {
    // เวลาเปิด dialog รีเซ็ตโค้ด/ส่วนลด
    if (isOpen) {
      setCode("");
      setDiscountInfo(null);
      setIsCheckingCode(false);
    }
  }, [isOpen]);

  const handleApplyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const clean = code.trim();
    if (!clean) return toast.error("กรุณากรอกโค้ดส่วนลด");

    if (isCheckingCode) return;
    setIsCheckingCode(true);

    try {
      const codeCheck = await checkDiscountcode(clean, productId);

      if (!codeCheck.success) {
        setDiscountInfo(null);
        toast.error(codeCheck.message);
        return;
      }

      if (!codeCheck.data) return;

      const dc = codeCheck.data;

      setDiscountInfo({
        key: dc.key,
        percent: dc.isPercent ? Number(dc.reward) : undefined,
        amount: dc.isPercent ? undefined : Number(dc.reward),
      });

      toast.success(codeCheck.message);
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setIsCheckingCode(false);
    }
  };

  const clearDiscount = () => {
    setDiscountInfo(null);
    setCode("");
  };

  const handleBuy = async () => {
    if (!session) return toast.error("กรุณาเข้าสู่ระบบก่อน");
    if (quantity <= 0)
      return toast.error("กรุณาเลือกจำนวนสินค้าที่ต้องการซื้อ");

    const BuyData = {
      userId: session.user.id,
      productId,
      quantity,
      // ✅ ใช้ยอดหลังส่วนลด (ยังคงเดิม)
      price: discountedTotal,
      code,
      byshopId,
    };

    try {
      toast.promise(mustOk(BuyAppPremium(BuyData)), {
        loading: "กำลังสั่งซื้อสินค้า...",
        success: (r) => r.message,
        error: (e) => e.message,
      })

      setIsOpen(false);

      const users = await getUserById(session.user.id);
      await update({ ...session, user: users });
      await refreshUser();
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
      setIsOpen(false);
    }
  };

  return (
    <div>
      {/* ✅ ส่วนด้านนอก dialog: แสดงยอดเติมเงิน (คงเดิม) */}
      <div className="my-2 flex flex-col gap-2 w-full sm:w-72">
        <Badge variant="outline" className="flex items-center justify-between">
          <span>ยอดรวมสินค้า</span>
          <span className="font-semibold">
            {baseTotal.toLocaleString()} บาท
          </span>
        </Badge>

        {feeAvailable && (
          <Badge
            variant="destructive"
            className="flex items-center justify-between"
          >
            <span>ค่าธรรมเนียม (2.9%)</span>
            <span className="font-semibold">+ {fee.toFixed(2)} บาท</span>
          </Badge>
        )}

        <Badge
          variant="destructive"
          className="flex items-center justify-between"
        >
          <span>ยอดที่ต้องเติมเงินผ่านวอลเลท</span>
          <span>{finalTotal.toLocaleString()} บาท</span>
        </Badge>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant={remain <= 0 ? "destructive" : "default"}
            disabled={remain <= 0}
            className={`w-full sm:w-auto text-lg px-6 py-3 rounded-xl flex items-center justify-center gap-2 ${
              remain <= 0 ? "opacity-70 cursor-not-allowed" : "btn-main"
            }`}
          >
            <ShoppingCart size={22} />
            {remain <= 0 ? "สินค้าหมด" : "สั่งซื้อสินค้า"}
          </Button>
        </DialogTrigger>

        {/* ✅ Dialog แบบพรีเมี่ยม + ScrollArea */}
        <DialogContent className="p-0 sm:max-w-[520px]">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="space-y-1.5">
              <div className="flex items-center gap-2 text-xl font-semibold text">
                <HugeiconsIcon icon={PackageIcon} strokeWidth={2.2} />
                ยืนยันการสั่งซื้อ
              </div>
              <DialogDescription className="font-medium">
                ตรวจสอบรายละเอียดก่อนกดยืนยัน (แสดงเฉพาะราคาสินค้า
                ไม่รวมค่าธรรมเนียม/ยอดเติมเงิน)
              </DialogDescription>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            <div className="px-6 pb-6">
              <div className="grid gap-4 mt-2 text-neutral-600">
                {/* สรุปการซื้อ (เฉพาะยอดสินค้า) */}
                <div className="bg-neutral-100/70 rounded-xl p-4 space-y-2 font-medium">
                  <div className="flex items-center justify-between">
                    <span>จำนวน</span>
                    <span className="text-black">{quantity} ชิ้น</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>ยอดรวมสินค้า</span>
                    <span className="text-black">
                      {baseTotal.toLocaleString()} บาท
                    </span>
                  </div>
                </div>

                {/* โค้ดส่วนลด */}
                <div className="bg-neutral-100/50 rounded-xl p-4 space-y-2.5 font-medium">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-800">โค้ดส่วนลด</span>
                      {discountInfo ? (
                        <Badge className="bg-emerald-500 text-white">
                          ใช้งานแล้ว
                        </Badge>
                      ) : (
                        <Badge variant="outline">ยังไม่ใช้</Badge>
                      )}
                    </div>

                    {discountInfo ? (
                      <button
                        type="button"
                        onClick={clearDiscount}
                        className="text-xs text-neutral-500 hover:text-red-500 duration-200"
                      >
                        ล้างโค้ด
                      </button>
                    ) : null}
                  </div>

                  <form onSubmit={handleApplyCode} className="flex gap-2">
                    <Input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="กรอกโค้ดส่วนลดของคุณ"
                      className="h-10 bg-white"
                      disabled={isCheckingCode}
                    />
                    <Button
                      type="submit"
                      className="h-10 btn-main"
                      disabled={isCheckingCode || !code.trim()}
                    >
                      {isCheckingCode ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          ตรวจสอบ...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <HugeiconsIcon icon={InspectCodeIcon} />
                          ตรวจสอบ
                        </span>
                      )}
                    </Button>
                  </form>

                  {discountInfo ? (
                    <div className="text-xs text-emerald-700 font-semibold">
                      ใช้โค้ด: {discountInfo.key}{" "}
                      {discountInfo.percent
                        ? `ลด ${discountInfo.percent}%`
                        : ""}
                      {discountInfo.amount ? `ลด ฿${discountInfo.amount}` : ""}
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-500">
                      กรอกโค้ดแล้วกดตรวจสอบเพื่อรับส่วนลด (ถ้ามี)
                    </div>
                  )}
                </div>

                {/* ราคารวมสินค้า (ไม่ใช่ยอดเติมเงิน) */}
                <div className="bg-emerald-50 border-1 border-emerald-600 rounded-xl p-4 space-y-1.5 font-semibold text-xl text-emerald-900">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2.5} />
                      ราคารวมสินค้า
                    </div>

                    <div className="text-right">
                      {discountInfo ? (
                        <div className="space-y-0.5">
                          <div className="text-xs font-semibold text-neutral-500 line-through">
                            ฿ {baseTotal.toLocaleString()}
                          </div>
                          <div className="text-emerald-900">
                            ฿ {discountedBaseTotal.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <>฿ {baseTotal.toLocaleString()}</>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-neutral-600 mt-1">
                    * หน้านี้แสดงเฉพาะ “ราคาสินค้า”
                    (ไม่รวมค่าธรรมเนียมการเติมเงิน)
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="px-6 pb-6 mt-1 gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" className="h-10">
                ยกเลิก
              </Button>
            </DialogClose>

            <Button className="btn-main h-10" onClick={handleBuy}>
              ยืนยันสั่งซื้อ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
