"use client";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { upgradeClass } from "@/lib/database/Class";

export default function UpgradeRank({ id }: { id: string }) {
  const handleUpgade = async () => {
    toast.promise(upgradeClass(id), {
      loading: "กำลังอัปเกรดคลาส...",
      success: "อัพเกรดคลาสสำเร็จ",
      error: "อัพเกรดคลาสไม่สำเร็จ",
    });
  };
  return (
    <Button variant={"outline"} className="w-full cursor-pointer" onClick={handleUpgade} >
      กดที่นี่เพื่ออัปเกรดคลาส
    </Button>
  );
}
