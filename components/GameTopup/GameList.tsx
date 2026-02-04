"use client";

import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { useState } from "react";

export default function GameList({ games }: { games: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = games.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="ค้นหาสินค้า..."
        className="border px-3 py-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div key={item.key}>
              <Link key={item.id} href={`/game_topup/${item.key}`}>
                <Card className="focus rounded-xl border bg-white cursor-pointer">
                  <CardContent className="flex flex-col items-start justify-center">
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gray-50">
                      <Image
                        src={`https://placehold.co/500x500?text=${encodeURIComponent(
                          item.name
                        )}`}
                        width={500}
                        height={500}
                        alt={`สินค้า ${item.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-base font-semibold">{item.name}</h3>
                    <button className="btn-main mt-3 px-3 py-1 rounded-lg text-sm w-full">
                      ดูรายละเอียด
                    </button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">ไม่พบสินค้า</p>
      )}
    </>
  );
}
