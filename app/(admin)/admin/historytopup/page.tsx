import { getAllHistoryTopup } from "@/lib/database/historytopup";
import { AdminTopupHis, columns } from "./columns";
import { DataTable } from "./data-table";


export default async function page() {
  const data: AdminTopupHis[] = await getAllHistoryTopup()
  return (
    <div className="header-admin container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">ประวัติการเติมเงิน</h1>
        <h2 className="text-sm text-gray-500">
          ประวัติการเติมเงินทั้งหมดของร้านค้า
        </h2>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
