"use client";

import { EditAppPremium } from "@/components/Admin/AppPremium/EditAppPremium";
import { ViewHistoryBuyButton } from "@/components/Admin/Historybuy/ViewHistoryBuyButton";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type AdminAppPremium = {
  id: string;
  name: string;
  price: Number;
  isDiscount: boolean;
  priceDiscount: Number;
  byshopId: string
};

export const columns: ColumnDef<AdminAppPremium>[] = [
  {
    accessorFn: (row) => row.name,
    header: "ชื่อสินค้า",
  },
  {
    accessorFn: (row) => row.price,
    header: "ราคา",
  },
  {
    accessorFn: (row) => row.isDiscount,
    header: "ส่วนลด",
    cell: ({ row }) => (
      <Badge variant={row.original.isDiscount ? "default" : "secondary"}>
        {row.original.isDiscount ? "มีส่วนลด" : "ไม่มีส่วนลด"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "จัดการ",
    cell: ({ row }) => {
      const app = row.original;
      return (
        <div className="flex gap-2">
          <EditAppPremium product={app} />
        </div>
      );
    },
  },
];
