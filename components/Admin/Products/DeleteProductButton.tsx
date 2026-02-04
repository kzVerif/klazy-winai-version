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
import { deleteProduct } from "@/lib/database/shop";
import { Badge } from "@/components/ui/badge";

export function DeleteProductButton({ id }: { id: string }) {
  function handleDelete(id: string) {
    toast.promise(deleteProduct(id), {
      loading: "กำลังลบ...",
      success: "ลบสินค้าสำเร็จ",
      error: "ลบไม่สำเร็จ กรุณาลองใหม่",
    });
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
           <Badge variant={"destructive"}>stocks ที่อยู่ภายในสินค้านี้จะถูกลบไปด้วยทั้งหมด</Badge>
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
