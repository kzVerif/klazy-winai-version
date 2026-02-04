"use client";
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
import { DialogDescription } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Products } from "@/app/(admin)/admin/products/columns";
import { addSuggestProducts } from "@/lib/database/suggestproducts";

export function AddProductSuggestButton({
  products,
}: {
  products: Products[];
}) {
  // 2. เปลี่ยนชื่อฟังก์ชัน
  async function handleAddProduct(formData: FormData) {
    const product = String(formData.get("product") || "");
    if (!product) {
      toast.error("กรุณาเลือกสินค้า");
      return;
    }

    // 3. เปลี่ยนข้อความ Toast
    toast.promise(addSuggestProducts(product), {
      loading: "กำลังบันทึก...",
      success: "บันทึกสินค้าแนะนำสำเร็จ",
      error: "ไม่สามารถบันทึกสินค้าแนะนำได้",
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* 5. อัปเดตปุ่ม Trigger */}
        <Button
          variant="secondary"
          className="cursor-pointer flex items-center gap-2 btn-main"
        >
          <Plus className="h-4 w-4" />
          <span>เพิ่มสินค้าแนะนำ</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {/* 6. อัปเดต Title และ Description */}
          <DialogTitle className="text">เพิ่มสินค้าแนะนำใหม่</DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดเพื่อเพิ่มเพิ่มสินค้าแนะนำใหม่ลงในระบบ
          </DialogDescription>
        </DialogHeader>

        {/* 7. อัปเดต action */}
        <form action={handleAddProduct} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="product">สินค้าแนะนำ</Label>

            {/* ส่งค่า category ผ่าน input hidden */}
            <input type="hidden" name="product" id="product-hidden" />

            <Select
              onValueChange={(value) => {
                const hidden = document.getElementById(
                  "product-hidden"
                ) as HTMLInputElement;
                hidden.value = value;
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกสินค้าแนะนำ" />
              </SelectTrigger>

              <SelectContent>
                {products.map((item) => (
                  <SelectItem value={item.id} key={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                ยกเลิก
              </Button>
            </DialogClose>

            {/* 13. อัปเดตข้อความปุ่ม Submit */}
            <Button type="submit" className="btn-main">
              เพิ่มสินค้าแนะนำ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
