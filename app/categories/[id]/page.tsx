import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoriesById } from "@/lib/database/category";
import { getProductByCategory } from "@/lib/database/shop";
import Image from "next/image";
import Link from "next/link";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const category = await getCategoriesById(id);
  const data = await getProductByCategory(id);
  return (
    <div className="container header">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">
          {category?.name ?? "ไม่พบหมวดหมู่"}
        </h1>
        <h2 className="text-sm text-gray-500">เลือกสินค้าที่สนใจได้เลย</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 ">
        {data.map((s: any, index: number) => (
          <div className="cursor-pointer focus" key={s.id}>
            <Link href={`/shop/${s.id}`}>
              <Card className="relative h-full overflow-hidden rounded-2xl border transition ">
                <CardContent className="flex flex-col items-start justify-center">
                   {s.isDiscount && (
                    <Badge className="absolute left-3 top-3 z-10" variant={"destructive"}>
                      🔥 ลด {s.price - s.priceDiscount} บาท
                    </Badge>
                  )}
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gray-50">
                    <Image
                      src={s.image}
                      width={500}
                      height={500}
                      alt={`สินค้า ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform ease-in-out duration-300"
                    />
                  </div>
                  <h3 className="text-base font-semibold ">{s.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {s.isDiscount ? (
                      <>
                        <Badge className="line-through font-bold" variant={"destructive"}>
                          <s>ราคา: {Number(s.price)}฿</s>
                        </Badge> {" "}
                        <Badge className="font-bold">
                          ราคา: {Number(s.priceDiscount)}฿
                        </Badge>
                      </>
                    ) : (
                      <Badge className="font-bold">
                        ราคา: {Number(s.price)}฿
                      </Badge>
                    )}
                  </p>
                  {s.stocks.length > 0 ? (
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
                  <h3 className="text-sm text-gray-500 mt-1 items-center">
                    คงเหลือ {s.stocks.length} ชิ้น
                  </h3>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
