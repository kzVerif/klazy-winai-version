"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createCode } from "@/lib/database/code";
import { Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddCodeButton() {
  const [enabled, setEnabled] = useState(false);
  async function handleAddCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      key: formData.get("key"),
      reward: Number(formData.get("reward")),
      maxUse: Number(formData.get("maxUse")),
      expired: new Date(formData.get("expired") as string),
      canDuplicateUse: enabled
    };

    const loadingToast = toast.loading("กำลังสร้างโค้ดใหม่...");
    const s = await createCode(data);
    toast.dismiss(loadingToast);
    if (!s.success) {
      toast.error(s.message || "สร้างโค้ดไม่สำเร็จ");
      return;
    }
    toast.success("สร้างโค้ดใหม่สำเร็จ");
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="flex items-center gap-2 btn-main"
        >
          <Plus className="h-4 w-4" />
          <span>เพิ่มโค้ดใหม่</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เพิ่มโค้ดใหม่</DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดเพื่อเพิ่มโค้ดใหม่ลงในระบบ
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddCode} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">ชื่อโค้ด</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="key">รหัสโค้ด</Label>
            <Input id="key" name="key" required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="reward">ยอดพ้อยที่จะได้รับ</Label>
            <Input id="reward" name="reward" type="number" required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="maxUse">จำนวนการใช้งานสูงสุด</Label>
            <Input id="maxUse" name="maxUse" type="number" required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="maxUse">การใช้ซ้ำ</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="bank-switch"
                checked={enabled}
                onCheckedChange={setEnabled}
                className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300"
              />
              <Label htmlFor="bank-switch">
                {enabled ? (
                  <Badge
                    variant={"secondary"}
                    className="bg-emerald-500 text-white transition-all ease-in-out duration-300"
                  >
                    ใช้ซ้ำได้
                  </Badge>
                ) : (
                  <Badge
                    variant={"outline"}
                    className="transition-all ease-in-out duration-300"
                  >
                    ใช้ซ้ำไม่ได้
                  </Badge>
                )}
              </Label>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="expired">วันหมดอายุ</Label>
            <Input id="expired" name="expired" type="datetime-local" required />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">ยกเลิก</Button>
            </DialogClose>
            <Button type="submit" className="btn-main">
              เพิ่มโค้ดใหม่
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
