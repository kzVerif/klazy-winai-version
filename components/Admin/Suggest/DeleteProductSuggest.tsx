"use client"
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
import { DeleteSuggestProduct } from "@/lib/database/suggestproducts";

export function DeleteProductSuggest({ id }: { id: string }) {
  async function handleDelete(id: string) {
    console.log("Delete user:", id);
    toast.promise(DeleteSuggestProduct(id), {
      loading: "กำลังลยสินค้าแนะนำ...",
      success: "ลบสินค้าแนะนำสำเร็จ",
      error: "ไม่สามารถลบสินค้าแนะนำได้"
    })
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
