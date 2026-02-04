import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteStock } from "@/lib/database/stocks";

export function DeleteStockButton({ id }: { id: string }) {
async function handleDelete(id: string) {
  toast.loading("กำลังลบสต็อค...");

  try {
    const deleted = await deleteStock(id);

    if (!deleted.status) {
      toast.error("ไม่สามารถลบสินค้าได้");
      return;
    }

    toast.success("ลบสินค้าสำเร็จ");
    setTimeout(() => {
      toast.dismiss()
    }, 1000);
  } catch (err) {
    toast.error("เกิดข้อผิดพลาด");
  }
}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>ยืนยันการลบ</DialogTitle>
          <DialogDescription>
            การลบรายการนี้เป็นการกระทำถาวรและไม่สามารถย้อนกลับได้
            คุณต้องการดำเนินการต่อหรือไม่
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline">ยกเลิก</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="destructive" onClick={() => handleDelete(id)}>
              ลบรายการ
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
