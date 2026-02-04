import { getAllHistoryBuy } from "@/lib/database/historybuy";
import { AdminBuyProduct, columns } from "./columns";
import { DataTable } from "./data-table";


export default async function page() {
  const data: AdminBuyProduct[] = await getAllHistoryBuy()
  return (
    <div className="header-admin container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">ประวัติการสั่งซื้อ</h1>
        <h2 className="text-sm text-gray-500">
          ประวัติการสั่งซื้อทั้งหมดของร้านค้า
        </h2>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
