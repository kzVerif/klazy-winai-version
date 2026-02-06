"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  MagicWand02Icon,
  PackageIcon,
  User02Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { useMemo, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { buyOrderProduct } from "@/lib/database/orders";
import { Input } from "@/components/ui/input"; // ✅ เพิ่ม
import { Badge } from "../ui/badge";
import { checkDiscountcode } from "@/lib/database/DiscountCode";
import { ScrollArea } from "../ui/scroll-area";
import { useUser } from "@/contexts/UserContext";

type Props = {
  selectedPackage: any;
  userInfo: {
    id_user: string;
    password_user: string;
    contact_user: string;
  };
};

export default function DialogConfirmPurchase({
  selectedPackage,
  userInfo,
}: Props) {
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshUser } = useUser();

  // ✅ โค้ดส่วนลด
  const [code, setCode] = useState("");
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<null | {
    key: string;
    percent?: number;
    amount?: number;
  }>(null);

  const price = useMemo(() => {
    if (!selectedPackage) return 0;
    return selectedPackage?.isDiscount
      ? Number(selectedPackage?.priceDiscount ?? 0)
      : Number(selectedPackage?.price ?? 0);
  }, [selectedPackage]);

  // ✅ ยอดหลังส่วนลด (ถ้ามี)
  const finalPrice = useMemo(() => {
    if (!discountInfo) return price;

    if (discountInfo.percent) {
      const cut = price * (discountInfo.percent / 100);
      return Math.max(0, Math.round((price - cut) * 100) / 100);
    }

    if (discountInfo.amount) {
      return Math.max(0, Math.round((price - discountInfo.amount) * 100) / 100);
    }

    return price;
  }, [price, discountInfo]);

  const canOpenConfirm =
    !!session &&
    !!selectedPackage &&
    !!userInfo.id_user &&
    !!userInfo.password_user &&
    !!userInfo.contact_user;

  const handleOpenConfirm = () => {
    if (!session) return toast.error("กรุณาเข้าสู่ระบบก่อน");
    if (!selectedPackage) return toast.error("กรุณาเลือกแพ็คสินค้า");
    if (
      !userInfo.id_user ||
      !userInfo.password_user ||
      !userInfo.contact_user
    ) {
      return toast.error("กรอกข้อมูลคำสั่งซื้อไม่ครบ");
    }

    // reset บางอย่างตอนเปิด
    setDiscountInfo(null);
    setCode("");
    setOpenConfirm(true);
  };

  const handleApplyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPackage) return;

    const clean = code.trim();
    if (!clean) return toast.error("กรุณากรอกโค้ดส่วนลด");
    if (isCheckingCode) return;

    setIsCheckingCode(true);

    try {
      const codeCheck = await checkDiscountcode(
        clean,
        selectedPackage.orderProductId, // ✅ ถ้า id สินค้าจริงคือ field นี้
      );

      if (!codeCheck.success) {
        setDiscountInfo(null);
        toast.error(codeCheck.message);
        return;
      }

      if (!codeCheck.data) {
         setDiscountInfo(null);
        toast.error("ไม่พบข้อมูลโค้ดส่วนลด");
        return;
      }

      const dc = codeCheck.data; // discountCode record
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

  const handleConfirmBuy = async () => {
    if (!session) return toast.error("กรุณาเข้าสู่ระบบก่อน");
    if (!selectedPackage) return toast.error("กรุณาเลือกแพ็คสินค้า");
    if (isSubmitting) return;

    setIsSubmitting(true);
    const loadingId = toast.loading("กำลังสั่งซื้อสินค้า...");

    try {
      const result = await buyOrderProduct(
        selectedPackage,
        session.user.id,
        userInfo,
        code.trim(),
      );

      toast.dismiss(loadingId);

      if (!result?.success) {
        toast.error(result?.message ?? "สั่งซื้อไม่สำเร็จ");
        return;
      }

      toast.success(result.message ?? "สั่งซื้อสำเร็จ");
      setOpenConfirm(false);
      await refreshUser()
    } catch (e) {
      toast.dismiss(loadingId);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form>
      <Button
        type="button"
        disabled={!selectedPackage || isSubmitting}
        className="btn-main w-full h-12 text-xl"
        onClick={handleOpenConfirm}
      >
        {selectedPackage ? "สั่งซื้อสินค้า" : "กรุณาเลือกแพ็คสินค้า"}
      </Button>

      <Dialog
        open={openConfirm}
        onOpenChange={(v) => !isSubmitting && setOpenConfirm(v)}
      >
        <DialogTrigger asChild></DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="space-y-1.5">
              <div className="flex items-center gap-2 text-xl text font-semibold">
                <HugeiconsIcon icon={PackageIcon} strokeWidth={2.2} />
                ยืนยันคำสั่งซื้อ
              </div>
              <DialogDescription className="font-medium">
                กรุณาตรวจสอบข้อมูลก่อนยืนยันการสั่งซื้อ
              </DialogDescription>
            </DialogTitle>
          </DialogHeader>
           <ScrollArea className="max-h-[70vh]">
          <div className="grid grid-cols-1 gap-4 mt-2 text-neutral-600">
            {/* ข้อมูลคำสั่งซื้อ */}
            <div className="bg-neutral-100/70 rounded-xl p-4 space-y-1.5 font-medium">
              <div className="flex items-center gap-1.5 mb-3">
                <HugeiconsIcon icon={User02Icon} strokeWidth={2} />{" "}
                ข้อมูลคำสั่งซื้อ
              </div>

              <div className="flex justify-between">
                ไอดีเกม:
                <span className="text-black">{userInfo.id_user}</span>
              </div>

              <div className="flex justify-between">
                รหัสผ่าน:
                <span className="text-black flex gap-1.5">
                  {showPassword ? userInfo.password_user : "••••••••"}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </span>
              </div>

              <div className="flex justify-between">
                ช่องทางติดต่อ:
                <span className="text-black">{userInfo.contact_user}</span>
              </div>
            </div>

            {/* แพ็คสินค้าที่เลือก */}
            <div className="bg-blue-50 border-1 border-blue-200 rounded-xl p-4 space-y-1.5 font-medium">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <HugeiconsIcon icon={MagicWand02Icon} strokeWidth={2} />{" "}
                  แพ็คสินค้าที่เลือก
                </div>
                <span className="text-black">{selectedPackage?.name}</span>
              </div>
            </div>

            {/* ✅ ใหม่: โค้ดส่วนลด (พรีเมี่ยม แต่เข้ากับดีไซน์เดิม) */}
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
                  placeholder="กรอกโค้ดส่วนลด"
                  className="h-10 bg-white"
                  disabled={isCheckingCode || isSubmitting}
                />
                <Button
                  type="submit"
                  className="h-10 btn-main"
                  disabled={isCheckingCode || isSubmitting || !code.trim()}
                >
                  {isCheckingCode ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      ตรวจสอบ...
                    </span>
                  ) : (
                    "ตรวจสอบ"
                  )}
                </Button>
              </form>

              {discountInfo ? (
                <div className="text-xs text-emerald-700 font-semibold">
                  ใช้โค้ด: {discountInfo.key}{" "}
                  {discountInfo.percent ? `ลด ${discountInfo.percent}%` : ""}
                  {discountInfo.amount ? `ลด ฿${discountInfo.amount}` : ""}
                </div>
              ) : (
                <div className="text-xs text-neutral-500">
                  กรอกโค้ดแล้วกดตรวจสอบ เพื่อรับส่วนลด (ถ้ามี)
                </div>
              )}
            </div>

            {/* ชำระเงิน */}
            <div className="bg-emerald-50 border-1 border-emerald-600 rounded-xl p-4 space-y-1.5 font-semibold text-xl text-emerald-900">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2.5} />{" "}
                  ยอดชำระ
                </div>

                <div className="text-right">
                  {discountInfo ? (
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-neutral-500 line-through">
                        ฿ {price.toLocaleString()}
                      </div>
                      <div className="text-emerald-900">
                        ฿ {finalPrice.toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <>฿ {price.toLocaleString()}</>
                  )}
                </div>
              </div>
            </div>
          </div>
          </ScrollArea>

          <DialogFooter className="mt-2 space-x-1">
            <DialogClose>
              <div className="flex justify-center items-center h-10 px-3 bg-white text-neutral-800 text-sm font-medium border-1 border-neutral-300 rounded-[12px] hover:text-red-500 hover:bg-gray-100 duration-300 hover:-translate-y-1">
                ยกเลิก
              </div>
            </DialogClose>

            <Button
              className="btn-main h-10"
              disabled={!canOpenConfirm || isSubmitting}
              onClick={handleConfirmBuy}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  กำลังสั่งซื้อ...
                </span>
              ) : (
                "ยืนยันซื้อ"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
