// 1. แก้ไข Import ให้ถูกต้อง
"use client";
import { mustOk } from "@/lib/mustOk";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogDescription } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import { Plus } from "lucide-react"; // 2. แก้ไขไอคอน
import { addStocks } from "@/lib/database/stocks";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export function AddStockButton({ productId }: { productId: string }) {
  // 4. อัปเดตฟังก์ชัน handleEdit
  async function handleEdit(formData: FormData) {
    const detail = String(formData.get("detail") || "");
    // แยกบรรทัด (รองรับ Windows + Unix)
    const lines = detail.split(/\r?\n/).filter((line) => line.trim() !== "");

    // สร้าง object สำหรับแต่ละบรรทัด
    const stockObjects = lines.map((line) => ({
      detail: line.trim(),
      status: true,
      productId,
    }));

    if (stockObjects.length === 0) {
      toast.error("กรุณากรอกข้อมูล");
      return;
    }

    toast.promise(addStocks(stockObjects), {
      loading: "กำลังเพิ่มสต็อค...",
      success: "เพิ่มสต็อคสำเร็จ",
      error: "เกิดข้อผิดพลาด",
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="cursor-pointer flex items-center gap-2 btn-main"
        >
          <Plus className="h-4 w-4" />
          <span>เพิ่มสต็อค</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {/* 9. อัปเดต Title/Description */}
          <DialogTitle className="text">เพิ่มสต็อคสินค้า</DialogTitle>
          <DialogDescription>
            ใส่รายการสต็อกของคุณทีละบรรทัด
            <br />
            ระบบจะนับ 1 บรรทัดเป็น 1ชิ้นอัตโนมัติ
          </DialogDescription>
        </DialogHeader>

        <form action={handleEdit} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="detail">รายละเอียด</Label>
            <ScrollArea className="h-40 max-h-40 overflow-auto rounded-md border">
              <Textarea
                id="detail"
                name="detail"
                required
                className="resize-none h-full"
                placeholder="ใส่รายละเอียดสต็อคของคุณ"
              />
            </ScrollArea>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                ยกเลิก
              </Button>
            </DialogClose>

            <Button type="submit" className="btn-main">
              เพิ่มสต้อคสินค้า
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
