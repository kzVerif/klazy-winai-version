"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { columns, TopupHis } from "./columns";
import { DataTable } from "./data-table";
import { getHistoryTopupByUserId } from "@/lib/database/historytopup";

export default function Page() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<TopupHis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      try {
        const dataHistoryBuy = await getHistoryTopupByUserId(session.user.id);

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
        <h1 className="text-2xl font-bold text">ประวัติการเติมเงิน</h1>
        <h2 className="text-sm text-gray-500">
          ประวัติการเติมเงินทั้งหมดของคุณ
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
