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
import { AdminTopupHis } from "@/app/(admin)/admin/historytopup/columns";
import { format } from "date-fns";

export function ViewHistoryTopupButton({
  topupHis,
}: {
  topupHis: AdminTopupHis;
}) {
  const date = new Date(topupHis.createdAt);
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
          <DialogTitle className="text">ประวัติการเติมเงิน</DialogTitle>
          <DialogDescription>ตรวจสอบประวัติการเติมเงิน</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4">
          <input type="hidden" name="id" value={topupHis.id} />

          <div className="grid gap-3">
            <Label htmlFor="name">รหัสอ้างอิง</Label>
            <Input
              id="refId"
              name="refId"
              defaultValue={topupHis.id}
              disabled
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="price">ผู้ใช้</Label>
            <Input
              id="owner"
              name="owner"
              defaultValue={topupHis.user.username}
              type="string"
              disabled
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="image">ประเภท</Label>
            <Input
              id="type"
              name="type"
              defaultValue={topupHis.topupType}
              type="text"
              disabled
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="detail">จำนวนเงิน</Label>
            <Input
              id="amount"
              name="amount"
              defaultValue={topupHis.amount}
              disabled
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="detail">หมายเหตุ</Label>
            <Input
              id="reason"
              name="reason"
              defaultValue={topupHis.reason}
              disabled
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="detail">เวลา</Label>
            <Input
              id="reason"
              name="reason"
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
      </DialogContent>
    </Dialog>
  );
}
