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

import { Categories } from "../../../lib/database/category";
import { addSuggestCategories } from "@/lib/database/suggestcategories";

export function AddCategoriesSuggestButton({
  categories,
}: {
  categories: Categories[];
}) {
  async function handleAddProduct(formData: FormData) {
    const categoryId = String(formData.get("category") || "");

    if (!categoryId) {
      toast.error("กรุณาเลือกหมวดหมู่");
      return;
    }

    toast.promise(addSuggestCategories(categoryId), {
      loading: "กำลังบันทึก...",
      success: "เพิ่มหมวดหมู่แนะนำสำเร็จ",
      error: "ไม่สามารถเพิ่มหมวดหมู่แนะนำได้",
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
          <span>เพิ่มหมวดหมู่แนะนำ</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text">เพิ่มหมวดหมู่แนะนำใหม่</DialogTitle>
          <DialogDescription>
            เลือกหมวดหมู่เพื่อเพิ่มลงในระบบ
          </DialogDescription>
        </DialogHeader>

        <form action={handleAddProduct} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="category">หมวดหมู่แนะนำ</Label>

            {/* Hidden input */}
            <input type="hidden" name="category" id="category-hidden" />

            <Select
              onValueChange={(value) => {
                const hidden = document.getElementById(
                  "category-hidden"
                ) as HTMLInputElement;
                hidden.value = value;
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกหมวดหมู่แนะนำ" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((item) => (
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

            <Button type="submit" className="btn-main">
              เพิ่มหมวดหมู่แนะนำ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
