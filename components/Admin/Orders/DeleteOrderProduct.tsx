"use client";
import { mustOk } from "@/lib/mustOk";
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
import { Badge } from "@/components/ui/badge";
import { deleteOrderProduct } from "@/lib/database/orders";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

export function DeleteOrderProduct({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  function handleDelete(id: string) {
    toast.promise(mustOk(deleteOrderProduct(id)), {
      loading: "กำลังลบสินค้าพรีออเดอร์...",
      success: (r) => r.message,
      error: (e) => e.message,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" className="cursor-pointer" onClick={() => setOpen(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>ลบสินค้า</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>ยืนยันการลบ</DialogTitle>
          <DialogDescription>
            การลบรายการนี้เป็นการกระทำถาวรและไม่สามารถย้อนกลับได้
            <Badge variant={"destructive"}>
              Packages ที่อยู่ภายในสินค้านี้จะถูกลบไปด้วยทั้งหมด
            </Badge>
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
