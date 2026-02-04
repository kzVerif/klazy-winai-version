import Link from "next/link";
import { Button } from "@/components/ui/button"; // ตรวจสอบ path ของคุณ
import { Package, ShoppingCart, Store } from "lucide-react"; // ไอคอน
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex items-center justify-center">
      {/* Card Container */}
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-white p-10 shadow-lg text-center">
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-2">
          <div className="rounded-full bg-blue-100 p-4">
            <Store className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            ยินดีต้อนรับ, {session?.user.username}
          </h1>
          <p className="text-sm text-gray-500">
            กรุณาเลือกเมนูที่ต้องการใช้งาน
          </p>
        </div>

        {/* Action Buttons Section */}
        <div className="grid gap-4">
          {/* ปุ่มไปหน้า Stocker */}
          <Link href="/stocker" className="w-full">
            <Button
              className="w-full h-14 text-lg justify-start gap-4"
              variant="outline"
            >
              <div className="bg-orange-100 p-2 rounded-md">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-900">จัดการสต็อก</span>
                <span className="text-xs text-gray-500 font-normal">
                  เข้าสู่เมนู Stocker
                </span>
              </div>
            </Button>
          </Link>

          {/* ปุ่มไปหน้า Orderer */}
          <Link href="/orderer" className="w-full">
            <Button
              className="w-full h-14 text-lg justify-start gap-4"
              variant="outline"
            >
              <div className="bg-green-100 p-2 rounded-md">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-900">
                  จัดการออเดอร์
                </span>
                <span className="text-xs text-gray-500 font-normal">
                  เข้าสู่เมนู Orderer
                </span>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
