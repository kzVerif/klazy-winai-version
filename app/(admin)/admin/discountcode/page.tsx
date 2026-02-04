
import { columns } from "./columns";
import { DataTable } from "./data-talbe";
import { getAllDicountCode } from "@/lib/database/DiscountCode";
import AddDiscountCodeButton from "@/components/Admin/DiscountCode/AddDiscountCodeButton";

export default async function page() {
  const data = await getAllDicountCode();

  return (
    <div className="header-admin">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">จัดการโค้ดเติมเงินส่วนลด</h1>
        <h2 className="text-sm text-gray-500">จัดการโค้ดเติมเงินส่วนลดทั้งหมดของคุณ</h2>
      </div>
      <div className="flex items-center justify-end">
        <AddDiscountCodeButton />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
