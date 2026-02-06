import { getAllHistoryDiscountCodes } from "@/lib/database/HistoryDiscountCode";
import { columns } from "./columns";
import { DataTable } from "./data-table";


export default async function page() {
  const data = await getAllHistoryDiscountCodes()

  return (
    <div className="header-admin container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">ประวัติการใช้โค้ดส่วนลด</h1>
        <h2 className="text-sm text-gray-500">
          ประวัติการสั่งใช้งานโค้ดส่วนลดของร้านค้า
        </h2>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
