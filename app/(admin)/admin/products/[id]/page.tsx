import { getStocksByProductId } from "@/lib/database/stocks";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getProductById } from "@/lib/database/shop";
import { AddStockButton } from "@/components/Admin/Products/Stock/AddStockButton";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const stocks = await getStocksByProductId(id);
  const product: any = await getProductById(id);

  return (
    <div className="header-admin">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">
          จัดการสต็อค {product?.name ?? "ไม่ทราบชื่อ"}
        </h1>
        <h2 className="text-sm text-gray-500">
          จัดการสินค้าคงเหลือในร้านค้าของคุณ
        </h2>
      </div>
      <div className="flex items-center justify-end">
        <AddStockButton productId={id}/>
      </div>
      <DataTable columns={columns} data={stocks} />
    </div>
  );
}
