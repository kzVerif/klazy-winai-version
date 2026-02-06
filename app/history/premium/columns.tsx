"use client";
import { ViewHistoryBuyAppPremiumButton } from "@/components/AppPremium/ViewHistoryBuyAppPremiumButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowDown01Icon, ArrowUp01Icon, Calendar01Icon, ShoppingBag01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export type BuyApp = {
    id: string,
    userId: string,
    info: string,
    appPremiumId: string,
    price: number,
    createdAt: Date,
    user: {
      id: string,
      username: string,
      password: string,
      role: string,
      points: number,
      totalPoints: number,
      createdAt: Date
    },
    appPremium: {
      id: string,
      name: string,
      price: number,
      isDiscount: boolean,
      priceDiscount: number
    }
  }

export const columns: ColumnDef<BuyApp>[] = [
  {
    accessorFn: (row) => row.appPremium.name,
    header: "สินค้าที่ซื้อ",
    cell: ({ row }) => {
      const name = row.original.appPremium.name;
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={ShoppingBag01Icon} size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-none">{name}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.user.username,
    header: "ผู้ใช้งาน",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={UserIcon} size={14} className="text-muted-foreground" />
        <span className="text-sm font-medium">{row.original.user.username}</span>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.info,
    header: "รายละเอียด",
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md border border-dashed truncate" title={row.original.info}>
          {row.original.info || "ไม่มีข้อมูล"}
        </p>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.price,
    header: "ยอดชำระ",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-primary">
          ฿{row.original.price.toFixed(2)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent font-bold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>วันที่ทำรายการ</span>
        {column.getIsSorted() === "asc" ? (
          <HugeiconsIcon icon={ArrowUp01Icon} size={14} className="ml-2" />
        ) : column.getIsSorted() === "desc" ? (
          <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="ml-2" />
        ) : (
          <HugeiconsIcon icon={Calendar01Icon} size={14} className="ml-2 text-muted-foreground" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{format(date, "dd MMM yyyy")}</span>
          <span className="text-[11px] text-muted-foreground">{format(date, "HH:mm:ss")} น.</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "จัดการ",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center justify-center">
          <ViewHistoryBuyAppPremiumButton product={product} />
        </div>
      );
    },
  },
];