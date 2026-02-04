import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllOrderProducts } from "@/lib/database/orders";
import { ShoppingBasket01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await getAllOrderProducts();

  return (
    <div className="container header">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">สั่งซื้อสินค้าแบบ Order</h1>
        <h2 className="text-sm text-gray-500">เลือกสินค้าที่สนใจได้เลย</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:md:grid-cols-2 gap-4">
        {data.map((s: any, index: number) => (
          <div className="cursor-pointer" key={s.id}>
            <Link href={`/order/${s.id}`}>
              <Card className="focus rounded-xl border bg-white cursor-pointer">
                <CardContent className="flex flex-col items-start justify-center">
                  <div className="w-full rounded-lg overflow-hidden mb-3 bg-gray-50">
                    <Image
                      src={
                        s.image ||
                        "https://placehold.co/1980x500?text=App+Premium"
                      }
                      width={1980}
                      height={500}
                      alt={`สินค้า ${index + 1}`}
                      className="w-full object-cover"
                    />
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <div>
                      <h3 className="text-base font-semibold ">{s.name}</h3>
                      <h3 className="text-sm">{s.detail}</h3>
                    </div>
                    <Button className="btn-main px-4 py-2 text-sm">
                      <HugeiconsIcon
                        icon={ShoppingBasket01Icon}
                        strokeWidth={2.5}
                      />
                      ดูสินค้า
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
