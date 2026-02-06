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
import toast from "react-hot-toast";
import { BuyApp } from "@/app/history/premium/columns";
export function ViewHistoryBuyAppPremiumButton({
  product,
}: {
  product: BuyApp;
}) {
  const date = new Date(product.createdAt);
  const formattedDate = format(date, "dd/MM/yyyy HH:mm");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          {/* 4. เปลี่ยนไปใช้ไอคอน Pencil */}
          <HugeiconsIcon icon={ViewIcon} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text">ประวัติการสั่งซื้อ</DialogTitle>
          <DialogDescription>ตรวจสอบประวัติการสั่งซื้อ</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
        <form className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">รหัสคำสั่งซื้อ</Label>

            <Input disabled name="id" value={product.id} />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="name">ชื่อสินค้า</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product.appPremium.name}
              disabled
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="image">ผู้ซื้อ</Label>
            <Input
              id="owner"
              name="owner"
              defaultValue={product.user.username}
              type="text"
              disabled
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="price">ยอดชำระ</Label>
            <Input
              id="price"
              name="price"
              type="number"
              defaultValue={product.price.toFixed(2)}
              disabled
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="detail">รายละเอียด</Label>
            <Label className="text-red-600">กรุณาอ่านกฏการใช้งานภายในช่องรายละเอียดก่อนเข้าใช้งาน</Label>
              <div
                className="text-sm break-all"
                dangerouslySetInnerHTML={{ __html: product.info }}
              />
            {/* <Button variant={"outline"} onClick={handleCopy}>
              <HugeiconsIcon icon={Copy01Icon} />
            </Button> */}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="time">วันที่</Label>
            <Input
              id="time"
              name="time"
              defaultValue={formattedDate}
              disabled
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                ปิด
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
