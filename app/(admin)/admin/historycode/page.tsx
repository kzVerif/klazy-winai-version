import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getAllHistoryCodes } from "@/lib/database/HistoryCode";


export default async function page() {
  const data = await getAllHistoryCodes()

  return (
    <div className="header-admin container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">ประวัติการใช้โค้ดเติมเงิน</h1>
        <h2 className="text-sm text-gray-500">
          ประวัติการสั่งใช้งานโค้ดของร้านค้า
        </h2>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
