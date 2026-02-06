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
import { Textarea } from "@/components/ui/textarea";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Copy01Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import { AdminBuyProduct } from "@/app/(admin)/admin/historybuy/columns";
export function ViewHistoryBuyButton({
  product,
}: {
  product: AdminBuyProduct;
}) {
  const date = new Date(product.createdAt);
  const formattedDate = format(date, "dd/MM/yyyy HH:mm");

  const handleCopy = async (e: any) => {
    e.preventDefault();
    await navigator.clipboard.writeText(product.stock.detail);
    toast.success("คัดลอกสำเร็จ")
  }
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

        <form className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">รหัสคำสั่งซื้อ</Label>

            <Input disabled name="id" value={product.id} />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="name">ชื่อสินค้า</Label>
            <Input id="name" name="name" defaultValue={product.product.name} disabled />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="name">ราคาที่จ่าย</Label>
            <Input id="name" name="name" defaultValue={`฿${product.price}`} disabled />
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
            <Label htmlFor="detail">รายละเอียด</Label>
            <ScrollArea className="h-40 rounded-md border">
            <Textarea
              id="detail"
              name="detail"
              defaultValue={product.stock.detail}
              disabled
              className="resize-none h-40 w-full p-2 break-all"
              />
              </ScrollArea>
              <Button variant={"outline"} onClick={handleCopy}><HugeiconsIcon icon={Copy01Icon} /></Button>
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
      </DialogContent>
    </Dialog>
  );
}
