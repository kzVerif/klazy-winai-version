"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { getHistoryBuyOrdersByUserId } from "@/lib/database/HistoryOrder";
import { columns, OderProduct } from "./colummns";

export default function Page() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OderProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      try {
        const dataHistoryBuy = await getHistoryBuyOrdersByUserId(session?.user.id)
        
        setOrders(dataHistoryBuy);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  return (
    <div className="header container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">ประวัติการสั่งซื้อสินค้าแบบพรีออเดอร์</h1>
        <h2 className="text-sm text-gray-500">
          ประวัติการสั่งซื้ออสินค้าแบบพรีออเดอร์ทั้งหมดของคุณ
        </h2>
      </div>

      {loading ? (
        <div>กำลังโหลดข้อมูล...</div>
      ) : (
        <DataTable columns={columns} data={orders} />
      )}
    </div>
  );
}
