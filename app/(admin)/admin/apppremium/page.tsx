import AppPremiumSetting from "@/components/Admin/AppPremium/AppPremiumSetting";
import { getAllAppPremiumProducts, getStatusAppremium } from "@/lib/database/apppremium";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function page() {
  const data = await getStatusAppremium();
  const apps = await getAllAppPremiumProducts()
  return (
    <div className="header-admin">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">จัดการสินค้าแอปพรีเมียม</h1>
        <h2 className="text-sm text-gray-500">
          จัดการสินค้าแอปพรีเมียมทั้งหมดของคุณ
        </h2>
      </div>
      <AppPremiumSetting data={data} />
      <DataTable columns={columns} data={apps} />
    </div>
  );
}
