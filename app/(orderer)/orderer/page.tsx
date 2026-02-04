import { DataTable } from "./data-table";
import { getAllHistoryBuyOrders } from "@/lib/database/HistoryOrder";
import { columns } from "./columns";
import BackButton from "@/components/BackButton";

export default async function Page() {
  const dataHistoryBuy = await getAllHistoryBuyOrders();

  return (
    <div className="header container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">
          จัดการคำสั่งซื้อสินค้าแบบพรีออเดอร์
        </h1>
        <h2 className="text-sm text-gray-500">
          จัดการคำสั่งซื้อสินค้าแบบพรีออเดอร์ทั้งหมดของคุณ
        </h2>
      </div>
      <BackButton/>
      <DataTable columns={columns} data={dataHistoryBuy} />
    </div>
  );
}
