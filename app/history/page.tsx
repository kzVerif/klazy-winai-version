"use client";

import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { DeliveryBox01Icon, GameController03Icon, YoutubeIcon } from "@hugeicons/core-free-icons";

const historyTypes = [
  {
    title: "สินค้าทั่วไป",
    desc: "ประวัติการสั่งซื้อสินค้าทั่วไป",
    path: "/history/buy",
    icon: DeliveryBox01Icon,
  },
  {
    title: "สินค้าพรีออเดอร์",
    desc: "ประวัติพรีออเดอร์ทั้งหมด",
    path: "/history/order",
    icon: DeliveryBox01Icon,
  },
  {
    title: "แอปพรีเมี่ยม",
    desc: "การซื้อแอปหรือบริการพรีเมี่ยม",
    path: "/history/premium",
    icon: YoutubeIcon,
  }
];

export default function Page() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto p-6 container header">
      <h1 className="text-2xl font-bold mb-6 text-center text">
        เลือกประเภทประวัติการสั่งซื้อ
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {historyTypes.map((item) => (
          <button
            key={item.title}
            onClick={() => router.push(item.path)}
            className="flex items-start gap-4 p-6 rounded-2xl border 
                       focus
                       transition text-left bg-white cursor-pointer"
          >
            <div className="text-3xl"><HugeiconsIcon icon={item.icon} size={32} /></div>
            <div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
