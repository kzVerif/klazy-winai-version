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
import { ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OderProduct } from "@/app/history/order/colummns";

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

const formatMoney = (n: number) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

export function ViewHistoryBuyOrderButton({
  product,
}: {
  product: OderProduct;
}) {
  const date = new Date(product.createdAt);
  const formattedDate = format(date, "dd/MM/yyyy HH:mm");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <HugeiconsIcon icon={ViewIcon} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-base font-semibold text">
                รายละเอียดคำสั่งซื้อพรีออเดอร์
              </DialogTitle>
              <DialogDescription className="text-sm">
                ตรวจสอบข้อมูลคำสั่งซื้อและสถานะรายการ
              </DialogDescription>
            </div>

            <StatusBadge status={product.status} />
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-2">
          <div className="grid gap-5">
            {/* ข้อมูลคำสั่งซื้อ */}
            <section className="rounded-xl border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-medium mb-3 text">ข้อมูลคำสั่งซื้อ</h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="order-id">รหัสคำสั่งซื้อ</Label>
                  <Input id="order-id" disabled value={product.id} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="package-name">ชื่อสินค้า</Label>
                  <Input
                    id="package-name"
                    disabled
                    value={product.orderPackage.name}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">ยอดชำระ</Label>
                    <Input
                      id="price"
                      disabled
                      value={formatMoney(Number(product.price))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="time">วันที่</Label>
                    <Input id="time" disabled value={formattedDate} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="reason">หมายเหตุ</Label>
                  <Input id="reason" disabled value={product.reason || "-"} />
                </div>
              </div>
            </section>

            {/* ข้อมูลเกม */}
            <section className="rounded-xl border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-medium mb-3 text">ข้อมูลเกม</h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="uid">ไอดีเกม</Label>
                  <Input
                    id="uid"
                    disabled
                    value={product.uid ?? "ไม่พบไอดีเกม"}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="statusText">สถานะ</Label>
                  <Input
                    id="statusText"
                    disabled
                    value={
                      product.status === "pending"
                        ? "รอดำเนินการ"
                        : product.status === "success"
                          ? "สำเร็จ"
                          : "ยกเลิก"
                    }
                  />
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              ปิด
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
