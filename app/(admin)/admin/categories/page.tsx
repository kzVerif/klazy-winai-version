import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { getCategories } from "@/lib/database/category";
import { EditCategoriesButton } from "@/components/Admin/Categories/EditCategorisButton";
import { DeleteCategoriesButton } from "@/components/Admin/Categories/DeleteCategoriesButtron";
import { AddCategoriesButtron } from "@/components/Admin/Categories/AddCategoriesButtron";

export default async function page() {
  const data = await getCategories();

  return (
    <div className="header-admin">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">จัดการหมวดหมู่</h1>
        <h2 className="text-sm text-gray-500">จัดการหมวดหมู่ทั้งหมดของคุณ</h2>
        <div className="flex items-end justify-end">
          <AddCategoriesButtron />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((c: any) => (
          <Card
            key={c.id}
            className="rounded-xl border bg-white cursor-pointer focus"
          >
            <CardContent className="flex flex-col items-start justify-center gap-3">
              <div className="w-full rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={c.image}
                  width={1980}
                  height={500}
                  alt={`หมวดหมู่ ${c.name}`}
                  className="w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <h3 className="text-sm text-gray-500">
                    จำนวนสินค้าทั้งหมด {c.products.length} รายการ
                  </h3>
                </div>
                <div className="flex gap-2">
                  <EditCategoriesButton category={c} />
                  <DeleteCategoriesButton id={c.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
