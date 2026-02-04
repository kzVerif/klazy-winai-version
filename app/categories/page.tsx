import { Card, CardContent } from "@/components/ui/card";
import { getStatusAppremiumForUser } from "@/lib/database/apppremium";
import { getCategories } from "@/lib/database/category";
import { getOrderSettingForUser } from "@/lib/database/orders";
import Image from "next/image";
import Link from "next/link";

export default async function page() {
  const data = await getCategories();
  const appCate = await getStatusAppremiumForUser();
  const orderCate = await getOrderSettingForUser();
  return (
    <div className="container header">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">หมวดหมู่ทั้งหมด</h1>
        <h2 className="text-sm text-gray-500">เลือกหมวดหมู่ที่สนใจได้เลย</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:md:grid-cols-2 gap-4">
        {appCate.status && (
          <div className="">
            <Link href={`/app_premium`}>
              <Card className="focus rounded-xl border bg-white cursor-pointer">
                <CardContent className="flex flex-col items-start justify-center">
                  <div className="w-full rounded-lg overflow-hidden mb-3 bg-gray-50">
                    <Image
                      src={
                        appCate.image ||
                        "https://placehold.co/1980x500?text=App+Premium"
                      }
                      width={1980}
                      height={500}
                      alt={`app_premium}`}
                      className="w-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text">แอปพรีเมี่ยม</h3>
                  <h3 className="text-sm">จำนวนสินค้าทั้งหมด 25 รายการ</h3>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}

        {orderCate?.status && (
          <Link href={`/order`}>
            <Card className="focus rounded-xl border bg-white cursor-pointer">
              <CardContent className="flex flex-col items-start justify-center">
                <div className="w-full rounded-lg overflow-hidden mb-3 bg-gray-50">
                  <Image
                    src={
                      orderCate.image ??
                      "https://placehold.co/1980x500?text=Order+Product"
                    }
                    width={1980}
                    height={500}
                    alt={`สั่งซื้อสินค้าแบบพรีออเดอร์`}
                    className="w-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text">
                  {"สั่งซื้อสินค้าแบบ Order"}
                </h3>
                <h3 className="text-sm">เลือกซื้อสินค้าแบบพรีออเดอร์ได้เลย</h3>
              </CardContent>
            </Card>
          </Link>
        )}

        {data.map((c: any, index: number) => (
          <div className="" key={c.id}>
            <Link href={`/categories/${c.id}`}>
              <Card className="focus rounded-xl border bg-white cursor-pointer">
                <CardContent className="flex flex-col items-start justify-center">
                  <div className="w-full rounded-lg overflow-hidden mb-3 bg-gray-50">
                    <Image
                      src={c.image}
                      width={1980}
                      height={500}
                      alt={`สินค้า ${index + 1}`}
                      className="w-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text">{c.name}</h3>
                  <h3 className="text-sm">
                    จำนวนสินค้าทั้งหมด {c.products.length} รายการ
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
