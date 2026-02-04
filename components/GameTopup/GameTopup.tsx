"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import toast from "react-hot-toast";
import BuyGameTopup from "./BuyGameTopup";
import { ShoppingCart } from "lucide-react";

interface ProductItem {
  name: string;
  sku: string;
  price: string;
}

interface GameTopupProps {
  gameName: string;
  items: ProductItem[];
}

export default function GameTopup({ gameName, items }: GameTopupProps) {
  const [selectedSKU, setSelectedSKU] = useState<string | null>(null);
  const [uid, setUid] = useState("");

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4 text">เติมเงินเกม {gameName}</h1>

      {/* UID Input */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="uid">กรอก UID ของคุณ</Label>
        <Input
          id="uid"
          placeholder="UID"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
        />
      </div>

      {/* เลือกแพ็คเกม */}
      <div className="space-y-3">
        <Label>เลือกแพ็คเกม</Label>
        {items.map((item) => (
          <Card
            key={item.sku}
            className={`cursor-pointer ${
              selectedSKU === item.sku ? "border-blue-500" : ""
            }`}
          >
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.price} ฿</p>
              </div>
              <Checkbox
                checked={selectedSKU === item.sku}
                onCheckedChange={() => setSelectedSKU(item.sku)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedSKU ? (
        <BuyGameTopup
          uid={uid}
          name={items.find((i) => i.sku === selectedSKU)?.name || ""}
          price={Number(items.find((i) => i.sku === selectedSKU)?.price || 0)}
        />
      ) : (
        <Button
          variant={"default"}
          className={`w-full sm:w-auto text-lg px-6 py-3 rounded-xl flex items-center justify-end gap-2 btn-main`}
          disabled
        >
          <ShoppingCart size={22} /> สั่งซื้อสินค้า
        </Button>
      )}
    </div>
  );
}
