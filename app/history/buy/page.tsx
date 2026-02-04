"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { columns, BuyProduct } from "./columns";
import { DataTable } from "./data-table";
import { getHistoryBuyByUserId } from "@/lib/database/historybuy";

export default function Page() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<BuyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      try {
        const dataHistoryBuy = await getHistoryBuyByUserId(session.user.id);

        // map ให้เข้ากับ BuyProduct type
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
        <h1 className="text-2xl font-bold text">ประวัติการสั่งซื้อ</h1>
        <h2 className="text-sm text-gray-500">
          ประวัติการสั่งซื้อทั้งหมดของคุณ
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
