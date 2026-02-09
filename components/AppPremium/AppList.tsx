"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon } from "@hugeicons/core-free-icons";

export default function AppList({
  products,
  apps,
}: {
  products: any[];
  apps: any[];
}) {
  const [search, setSearch] = useState("");
  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | "">("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  

  const CATEGORY_LIST = [
    "Netflix",
    "Youtube",
    "Spotify",
    "iQIYI",
    "Disney",
    "MonoMax",
    "MAX",
    "Prime",
    "VIU",
    "Wetv",
    "TrueID",
    "Bilibili",
    "CH3",
    "YOUKU",
    "oneD",
  ];

  const filtered = products
    // 🔍 ค้นหาชื่อ
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))

    // 🏷️ กรองหมวดหมู่
    .filter((item) =>
      selectedCategories.length === 0
        ? true
        : selectedCategories.includes(item.category),
    )

    // 💰 เรียงราคา
    .sort((a, b) => {
      if (!sortPrice) return 0;

      const priceA = Number(a.price);
      const priceB = Number(b.price);

      return sortPrice === "asc" ? priceA - priceB : priceB - priceA;
    });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const getAppPrice = (productName: string) => {
    const app = apps.find((a) => a.name.trim() === productName.trim());
    return app ? Number(app.price) : 0;
  };

  const getIsDiscount = (productName: string) => {
    const app = apps.find((a) => a.name.trim() === productName.trim());
    return app ? app.isDiscount : false;
  };

  const getAppPriceDiscount = (productName: string) => {
    const app = apps.find((a) => a.name.trim() === productName.trim());
    return app ? Number(app.priceDiscount) : 0;
  };

const getLink = (id: string) => {
  const app = apps.find((a) => a.byshopId?.trim() === id?.trim());
  
  // Return the app.id if found, otherwise return the original p.id or a placeholder
  return app ? app.id : id; 
};
  return (
    <div>
      <div className="flex items-center justify-start mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <HugeiconsIcon icon={FilterIcon} size={26} /> ตัวกรองสินค้า
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>รายการตัวกรองสินค้า</SheetTitle>
              <SheetDescription>
                เลือกกรองสินค้าที่คุณต้องการได้เลย
                ก่อนการค้นหากรุณาทำช่องค้นหาให้ว่าง
              </SheetDescription>
            </SheetHeader>

            {/* เรียงราคา */}
            <div className="px-4">
              <div className="">
                <h4 className="font-semibold mb-2">เรียงราคา</h4>
                <div className="flex gap-2">
                  <Button
                    variant={sortPrice === "asc" ? "default" : "outline"}
                    onClick={() => setSortPrice("asc")}
                  >
                    น้อย → มาก
                  </Button>
                  <Button
                    variant={sortPrice === "desc" ? "default" : "outline"}
                    onClick={() => setSortPrice("desc")}
                  >
                    มาก → น้อย
                  </Button>
                </div>
              </div>

              {/* หมวดหมู่ */}
              <div className="mt-6">
                <h4 className="font-semibold mb-2">หมวดหมู่</h4>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_LIST.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ล้างตัวกรอง */}
            <Button
              variant="ghost"
              className="mt-6 w-full"
              onClick={() => {
                setSearch("");
                setSortPrice("");
                setSelectedCategories([]);
              }}
            >
              ล้างตัวกรองทั้งหมด
            </Button>
          </SheetContent>
        </Sheet>
      </div>
      <input
        type="text"
        placeholder="ค้นหาสินค้า..."
        className="border px-3 py-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-2 lg:grid-cols-5">
        {filtered.length > 0 ? (
          filtered.map((p) => {
            // ✅ แก้ไข: เมื่อมีการประกาศตัวแปร ต้องใส่ปีกกาครอบ และต้องมี return
            
            const myapp = getLink(p.id);

            return (
              <div className="p-2" key={p.id}>
                {/* ✅ แนะนำ: ใช้ myapp.id แทน p.id ถ้าต้องการลิงก์ไปยังแอปที่ถูกต้อง */}
                <Link href={`/app_premium/${myapp}`}>
                  <Card className="relative h-full overflow-hidden rounded-2xl border transition focus">
                    <CardContent className="flex flex-col items-start justify-center">
                      {getIsDiscount(p.name) && (
                        <Badge
                          className="absolute left-3 top-3 z-10"
                          variant={"destructive"}
                        >
                          🔥 ลด{" "}
                          {getAppPrice(p.name) - getAppPriceDiscount(p.name)}{" "}
                          บาท
                        </Badge>
                      )}

                      <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gray-50">
                        <Image
                          src={p.img}
                          width={500}
                          height={500}
                          alt={`สินค้า ${p.name}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform ease-in-out duration-300"
                        />
                      </div>

                      <h3 className="text-base font-semibold">{p.name}</h3>

                      <div className="text-sm text-gray-500 mt-1">
                        {getIsDiscount(p.name) ? (
                          <div className="flex flex-col gap-1">
                            <Badge
                              className="line-through font-bold w-fit"
                              variant={"destructive"}
                            >
                              <s>ราคา: {getAppPrice(p.name)}฿</s>
                            </Badge>
                            <Badge className="font-bold w-fit">
                              ราคา: {getAppPriceDiscount(p.name)}฿
                            </Badge>
                          </div>
                        ) : (
                          <Badge className="font-bold">
                            ราคา: {getAppPrice(p.name)}฿
                          </Badge>
                        )}
                      </div>

                      {p.stock > 0 ? (
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

                      <h3 className="text-[10px] text-gray-400 mt-2 items-center">
                        คงเหลือ {p.stock} ชิ้น
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 col-span-full text-center py-10">
            ไม่พบสินค้า
          </p>
        )}
      </div>
    </div>
  );
}
