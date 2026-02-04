"use server";
import prisma from "@/lib/database/conn";
import { expiredCheck } from "@/lib/database/expire";

interface Props {
  children: React.ReactNode;
}
export default async function ExpiredGuard({ children }: Props) {
  const expired = await expiredCheck();
  const now = new Date();
  if (!expired) {
    // redirect ไป /expired
    return (
      <div className="header flex flex-col items-center justify-center ">
        {/* ไอคอนหรือภาพ */}
        <div className="text-9xl mb-8 text-orange-400 animate-pulse">⏰</div>

        {/* หัวข้อ */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          เว็บไซต์หมดอายุแล้ว
        </h1>

        {/* คำอธิบาย */}
        <p className="text-center text-gray-600 mb-8 max-w-xl">
          ขณะนี้เว็บไซต์นี้หมดอายุการใช้งานแล้ว
          หากคุณต้องการเข้าถึงข้อมูลหรือบริการเพิ่มเติม กรุณาติดต่อผู้ดูแลระบบ
        </p>

        {/* ปุ่ม */}
        <div className="flex gap-4">
          <a
            href="https://discord.gg/YhUs3vnKxG"
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition ease-in-out duration-300"
          >
            ติดต่อผู้ดูแล
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
