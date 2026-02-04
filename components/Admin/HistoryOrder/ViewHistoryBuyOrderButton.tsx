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
import { ViewIcon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import * as React from "react";
import { OderProductAdmin } from "@/app/(admin)/admin/historyorder/columns";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateStatusOrder } from "@/lib/database/orders";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { text: string; className: string }> = {
    pending: {
      text: "รอดำเนินการ",
      className:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800/50",
    },
    success: {
      text: "สำเร็จ",
      className:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800/50",
    },
    cancel: {
      text: "ยกเลิก",
      className:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800/50",
    },
  };

  const v = map[status] ?? {
    text: status,
    className:
      "bg-muted text-foreground border-border dark:bg-muted/50 dark:text-foreground",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        v.className,
      ].join(" ")}
    >
      {v.text}
    </span>
  );
}

export function ViewHistoryBuyOrderButton({
  product,
}: {
  product: OderProductAdmin;
}) {
  const date = new Date(product.createdAt);
  const formattedDate = format(date, "dd/MM/yyyy HH:mm");
  const [showPass, setShowPass] = React.useState(false);

  const uidValue = product.uid ?? "";
  const passValue = product.pass ?? "";

  const copyText = async (text: string, label: string) => {
    if (!text) {
      toast.error(`ไม่มี${label}ให้คัดลอก`);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`คัดลอก${label}แล้ว`);
    } catch {
      toast.error(`คัดลอก${label}ไม่สำเร็จ`);
    }
  };

  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submitCancel = async () => {
    const reason = cancelReason.trim();

    if (reason.length < 3) {
      toast.error("กรุณากรอกเหตุผลอย่างน้อย 3 ตัวอักษร");
      return;
    }

      setLoading(true);

      // TODO: ยิง server action / api ของคุณ
      toast.promise(updateStatusOrder(product.id, "cancel", reason), {
        success: "แก้ไขสถานะสำเร็จ",
        loading: "กำลังแก้ไขสถานะ",
        error: "แก้ไขสถานะไม่สำเร็จ"
      })
      setCancelOpen(false);
      setCancelReason("");
      setLoading(false);
  };

  const [successOpen, setSuccessOpen] = React.useState(false);

  const submitSuccess = async () => {
    try {
      setLoading(true);

      // TODO: ยิง server action / api ของคุณ
      const loading = toast.loading("กำลังแก้ไขสถานะคำสั่งซื้อเปน สำเร็จ")
      const status = await updateStatusOrder(product.id, "success", "ส่งสินค้าสำเร็จ");
      toast.dismiss(loading)
      if (!status.success) {
        toast.error(status.message)
        return
      }
      toast.success(status.message)
      setSuccessOpen(false);
    } catch (e) {
      toast.error("ทำรายการไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const canSetSuccess = product.status === "pending";
  const canCancel = product.status === "pending";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <HugeiconsIcon icon={ViewIcon} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[520px]">
        <DialogHeader className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-base font-semibold text">
                ประวัติการสั่งซื้อสินค้าพรีออเดอร์
              </DialogTitle>
              <DialogDescription className="text-sm">
                ตรวจสอบรายละเอียดคำสั่งซื้อและข้อมูลบัญชีเกม
              </DialogDescription>
            </div>

            <StatusBadge status={product.status} />
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-2">
          <div className="grid gap-5">
            {/* SECTION: Order Info */}
            <section className="rounded-xl border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-medium mb-3 text">
                ข้อมูลคำสั่งซื้อ
              </h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="order-id">รหัสคำสั่งซื้อ</Label>
                  <Input id="order-id" disabled value={product.id} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="product-name">ชื่อสินค้า</Label>
                  <Input
                    id="product-name"
                    defaultValue={product.orderProduct.name}
                    disabled
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="package-name">ชื่อแพ็ค</Label>
                  <Input
                    id="package-name"
                    defaultValue={product.orderPackage.name}
                    disabled
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="reason">หมายเหตุ</Label>
                  <Input
                    id="reason"
                    defaultValue={product.reason || "-"}
                    disabled
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">ยอดชำระ</Label>
                    <Input
                      id="price"
                      defaultValue={String(product.price)}
                      disabled
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="time">วันที่</Label>
                    <Input id="time" defaultValue={formattedDate} disabled />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION: Game Account */}
            <section className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-sm font-medium text">ข้อมูลบัญชีเกม</h3>
              </div>

              <div className="grid gap-4">
                {/* UID row */}
                <div className="grid gap-2">
                  <Label htmlFor="uid">ไอดีเกม</Label>
                  <div className="flex gap-2">
                    <Input
                      id="uid"
                      value={uidValue || "ไม่พบไอดีเกม"}
                      disabled
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="shrink-0"
                      onClick={() => copyText(uidValue, "ไอดีเกม")}
                      title="คัดลอกไอดีเกม"
                    >
                      <HugeiconsIcon icon={Copy01Icon} />
                      <span className="ml-2 hidden sm:inline">Copy</span>
                    </Button>
                  </div>
                </div>

                {/* PASS row */}
                <div className="grid gap-2">
                  <Label htmlFor="password">รหัสเกม</Label>
                  <div className="flex gap-2">
                    <Input
                      id="password"
                      type={showPass ? "text" : "password"}
                      value={passValue || "ไม่พบรหัส"}
                      disabled
                    />

                    <Button
                      type="button"
                      variant="secondary"
                      className="shrink-0"
                      onClick={() => setShowPass((v) => !v)}
                      title={showPass ? "ซ่อนรหัส" : "แสดงรหัส"}
                    >
                      {showPass ? "ซ่อน" : "แสดง"}
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      className="shrink-0"
                      onClick={() => copyText(passValue, "รหัสเกม")}
                      title="คัดลอกรหัสเกม"
                    >
                      <HugeiconsIcon icon={Copy01Icon} />
                      <span className="ml-2 hidden sm:inline">Copy</span>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* ฝั่งเปลี่ยนสถานะ */}
          <div className="space-y-1">
            <p className="text-sm font-medium text">เปลี่ยนสถานะคำสั่งซื้อ</p>
            <p className="text-xs text-muted-foreground">
              คลิกที่ปุ่มเพื่อเปลี่ยนสถานะของคำสั่งซื้อนี้
            </p>
          </div>

          <div className="flex gap-2">
            {/* ✅ สำเร็จ (Confirm อย่างเดียว) */}

            <AlertDialog open={successOpen} onOpenChange={setSuccessOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="default"
                  className="cursor-pointer"
                  disabled={loading || !canSetSuccess}
                  title={
                    canSetSuccess
                      ? "เปลี่ยนสถานะเป็นสำเร็จ"
                      : "ทำได้เฉพาะสถานะรอดำเนินการ"
                  }
                >
                  สำเร็จ
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="sm:max-w-[520px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text">
                    ยืนยันเปลี่ยนสถานะเป็น “สำเร็จ”
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    เมื่อยืนยันแล้ว ระบบจะเปลี่ยนสถานะคำสั่งซื้อนี้เป็น “สำเร็จ”
                    ทันที
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>กลับ</AlertDialogCancel>
                  <Button
                    type="button"
                    variant="default"
                    onClick={submitSuccess}
                    disabled={loading}
                  >
                    {loading ? "กำลังบันทึก..." : "ยืนยัน"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* ❌ ยกเลิก (Confirm + Reason) */}
            <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={loading || !canCancel}
                  title={
                    canCancel
                      ? "เปลี่ยนสถานะเป็นยกเลิก"
                      : "ทำได้เฉพาะสถานะรอดำเนินการ"
                  }
                >
                  ยกเลิก
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="sm:max-w-[520px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text">
                    ยืนยันการยกเลิกคำสั่งซื้อ
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    กรุณาระบุเหตุผลในการยกเลิก
                    ระบบจะบันทึกเหตุผลไว้ในรายการคำสั่งซื้อนี้
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="grid gap-2">
                  <Label htmlFor="cancel-reason">เหตุผล</Label>
                  <Textarea
                    id="cancel-reason"
                    placeholder="เช่น ลูกค้าขอยกเลิก / สินค้าหมด / ข้อมูลไม่ครบ ฯลฯ"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="min-h-[110px]"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    * อย่างน้อย 3 ตัวอักษร
                  </p>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>กลับ</AlertDialogCancel>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={submitCancel}
                    disabled={loading}
                  >
                    {loading ? "กำลังบันทึก..." : "ยืนยันยกเลิก"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* ฝั่งปิด */}
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer"
              disabled={loading}
            >
              ปิด
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
