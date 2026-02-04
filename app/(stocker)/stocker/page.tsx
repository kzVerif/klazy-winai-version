import { getAllProducts } from "@/lib/database/shop";
import { columns, Products } from "./columns";
import { DataTable } from "./data-table";
import BackButton from "@/components/BackButton";

export default async function page() {
  const data: Products[] = await getAllProducts();  
  return (
    <div className="header-admin">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">จัดการสินค้า</h1>
        <h2 className="text-sm text-gray-500">
          จัดการสินค้าทั้งหมดในร้านค้าของคุณ
        </h2>
      </div>
        <BackButton/>
        <DataTable columns={columns} data={data} />
    </div>
  );
}
