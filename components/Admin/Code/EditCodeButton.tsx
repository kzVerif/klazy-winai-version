import { AllCodes } from "@/app/(admin)/admin/code/columns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateCode } from "@/lib/database/code";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function EditCodeButton({ code }: { code: AllCodes }) {
    const [enabled, setEnabled] = useState(code.canDuplicateUse);
  const [isOpen, setIsOpen] = useState(false);
  function formatDateToInput(date: Date | string) {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      id: code.id,
      name: formData.get("name"),
      key: formData.get("key"),
      reward: Number(formData.get("reward")),
      maxUse: Number(formData.get("maxUse")),
      expired: new Date(formData.get("expired") as string),
      canDuplicateUse: enabled
    };
    const loadingToast = toast.loading("กำลังแก้ไข้โค้ด...");
    const s = await updateCode(data);
    toast.dismiss(loadingToast);
    if (!s.success) {
      toast.error(s.message || "สร้างแก้ไข้โค้ดไม่สำเร็จ");
      return;
    }
    toast.success("แก้ไข้โค้ดสำเร็จ");
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          {/* 4. เปลี่ยนไปใช้ไอคอน Pencil */}
          <HugeiconsIcon icon={PencilEdit02Icon} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เพิ่มโค้ดใหม่</DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดเพื่อเพิ่มโค้ดใหม่ลงในระบบ
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">ชื่อโค้ด</Label>
            <Input
              id="name"
              name="name"
              defaultValue={code.name || ""}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="key">รหัสโค้ด</Label>
            <Input id="key" name="key" defaultValue={code.key || ""} required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="reward">ยอดพ้อยที่จะได้รับ</Label>
            <Input
              id="reward"
              name="reward"
              type="number"
              defaultValue={code.reward || 0}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="maxUse">จำนวนการใช้งานสูงสุด</Label>
            <Input
              id="maxUse"
              name="maxUse"
              type="number"
              defaultValue={code.maxUse || 0}
              required
            />
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
            <Input
              id="expired"
              name="expired"
              type="datetime-local"
              defaultValue={formatDateToInput(code.expired || new Date())}
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setIsOpen(false)}>ยกเลิก</Button>
            </DialogClose>
            <Button type="submit" className="btn-main">
              แก้ไขโค้ด
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
