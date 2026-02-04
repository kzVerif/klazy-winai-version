import { DataTable } from "./data-table";
import { AllCodes, columns } from "./columns";
import { getAllCode } from "@/lib/database/code";
import AddCodeButton from "@/components/Admin/Code/AddCodeButton";


export default async function page() {
  const data: AllCodes[] = await getAllCode();
  
  
  return (
    <div className="header-admin">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">จัดการโค้ดเติมเงิน</h1>
        <h2 className="text-sm text-gray-500">จัดการโค้ดเติมเงินทั้งหมดของคุณ</h2>
      </div>
      <div className="flex items-center justify-end">
        <AddCodeButton />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
