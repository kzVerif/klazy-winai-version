"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // ปรับ path ตาม structure จริงของคุณ (ปกติมักจะมี @/components นำหน้า)
import { ChevronLeft } from "lucide-react"; // ต้องติดตั้ง lucide-react ก่อน

interface BackButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export default function BackButton({ 
  className, 
  variant = "secondary" // ตั้งค่าเริ่มต้นเป็น secondary ตามที่คุณต้องการ
}: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant={variant}
      size="sm" // แนะนำ: ปุ่มย้อนกลับมักจะไม่ต้องใหญ่มาก ใช้ size="sm" จะดูคลีนกว่า (ลบออกได้ถ้าชอบใหญ่ๆ)
      onClick={() => router.back()}
      className={`flex items-center gap-1 pl-2.5 ${className} cursor-pointer`} // pl-2.5 ช่วยจัดบาลานซ์เมื่อมีไอคอนซ้ายสุด
    >
      <ChevronLeft className="h-4 w-4" />
      ย้อนกลับ
    </Button>
  );
}