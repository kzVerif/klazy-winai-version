import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getAllHistory } from "@/lib/database/Dashboard";

export default async function page() {
  const data = await getAllHistory();

  return (
    <div className="header-admin container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">รายงานยอดขายเดือนนี้</h1>
        <h2 className="text-sm text-gray-500">
          รายงานยอดขายเดือนนี้ของร้านค้า
        </h2>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
