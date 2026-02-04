import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { getCategories } from "@/lib/database/category";
import { DeleteCategoriesSiggestButton } from "@/components/Admin/Suggest/DeleteCategoriesSiggestButton";
import { AddCategoriesSuggestButton } from "@/components/Admin/Suggest/AddCategoriesSuggestButton";
import { DeleteProductSuggest } from "@/components/Admin/Suggest/DeleteProductSuggest";
import { AddProductSuggestButton } from "@/components/Admin/Suggest/AddProductSuggestButton";
import { getAllSuggestCategories } from "@/lib/database/suggestcategories";
import {
  getAllSuggestProducts,
  suggestProducts,
} from "@/lib/database/suggestproducts";
import { getAllProducts } from "@/lib/database/shop";
import { Badge } from "@/components/ui/badge";

interface SuggestCategories {
  id: string;
  categoriesId: string;
  category: {
    id: string;
    name: string;
    image: string | null;
  };
  amount: number;
}

export default async function page() {
  const categories = await getCategories();
  const suggestcategories: SuggestCategories[] =
    await getAllSuggestCategories();

  const suggestProducts: suggestProducts[] = await getAllSuggestProducts();
  const products = await getAllProducts();
  return (
    <div className="header-admin">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">หมวดหมู่แนะนำ</h1>
        <h2 className="text-sm text-gray-500">
          เลือกหมวดหมู่ที่คุณอยากให้ลูกค้าเห็นก่อนเป็นพิเศษ
        </h2>
        <div className="flex items-end justify-end">
          <AddCategoriesSuggestButton categories={categories} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestcategories.map((c) => (
          <Card
            key={c.id}
            className="rounded-xl border bg-white cursor-pointer"
          >
            <CardContent className="flex flex-col items-start justify-center gap-3">
              <div className="w-full rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={c.category.image ?? ""}
                  width={1980}
                  height={300}
                  alt={`หมวดหมู่ ${c.category.name}`}
                  className="w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="font-semibold">{c.category.name}</h3>
                  <h3 className="text-sm text-gray-500">
                    จำนวนสินค้าทั้งหมด {c.amount ?? 0} รายการ
                  </h3>
                </div>
                <div className="flex gap-2">
                  <DeleteCategoriesSiggestButton id={c.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold text">สินค้าแนะนำ</h1>
        <h2 className="text-sm text-gray-500">
          เลือกสินค้าที่คุณอยากให้ลูกค้าเห็นก่อนเป็นพิเศษ
        </h2>
        <div className="flex items-end justify-end mb-3">
          <AddProductSuggestButton products={products} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {suggestProducts.map((s, index: number) => (
            <div className="cursor-pointer" key={s.id}>
              <Card className="rounded-xl border bg-white">
                <CardContent className="flex flex-col items-start justify-center">
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gray-50">
                    <Image
                      src={s.product.image ?? ""}
                      width={500}
                      height={500}
                      alt={s.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-base font-semibold ">{s.product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    <Badge className="font-bold">
                      ราคา: {Number(s.product.price)}฿
                    </Badge>
                  </p>
                  {s.product.stocks.length > 0 ? (
                    <button className="btn-main mt-3 px-3 py-1 rounded-lg text-sm w-full">
                      ดูรายละเอียด
                    </button>
                  ) : (
                    <button
                      disabled
                      className="btn-main mt-3 px-3 py-1 rounded-lg text-sm w-full opacity-50"
                    >
                      สินค้าหมด
                    </button>
                  )}
                  <div className="flex items-center justify-between w-full mt-2">
                    <h3 className="text-sm text-gray-500 mt-1 items-center">
                      คงเหลือ {s.product.stocks.length} ชิ้น
                    </h3>
                    <DeleteProductSuggest id={s.id} />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
