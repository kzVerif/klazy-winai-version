"use client";

import { ViewHistoryBuyOrderButton } from "@/components/order/ViewHistoryBuyOrderButton";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type OderProduct = {
  id: string;
  uid: string | null;
  pass: string | null;
  contact: string | null;
  userId: string;
  orderProductId: string;
  orderPackageId: string;
  price: number;
  createdAt: Date;
  websiteId: string;
  status: string;
  reason: string;
  orderPackage: {
    id: string;
    name: string;
    price: number;
    isDiscount: boolean;
    priceDiscount: number;
    websiteId: string;
    orderProductId: string;
  };
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { text: string; className: string }> = {
    pending: {
      text: "รอดำเนินการ",
      className:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800/50",
    },
    success: {
      text: "สำเร็จ",
      className:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800/50",
    },
    cancel: {
      text: "ยกเลิก",
      className:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800/50",
    },
  };

  const v = map[status] ?? {
    text: status,
    className:
      "bg-muted text-foreground border-border dark:bg-muted/50 dark:text-foreground",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        v.className,
      ].join(" ")}
    >
      {v.text}
    </span>
  );
}

const formatMoney = (n: number) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

function SortHeader({ title, column }: { title: string; column: any }) {
  const s = column.getIsSorted(); // false | "asc" | "desc"
  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(s === "asc")}
      className="inline-flex items-center gap-1 font-semibold hover:opacity-80 select-none"
      title="คลิกเพื่อเรียงลำดับ"
    >
      <span>{title}</span>
      <span className="text-xs">
        {s === "asc" ? "↑" : s === "desc" ? "↓" : "↕"}
      </span>
    </button>
  );
}

export const columns: ColumnDef<OderProduct>[] = [
  {
    id: "productName",
    accessorFn: (row) => row.orderPackage.name,
    header: "ชื่อสินค้า",
    cell: ({ row }) => {
      const name = row.original.orderPackage?.name ?? "-";
      return (
        <span className="block max-w-[220px] truncate" title={name}>
          {name}
        </span>
      );
    },
  },

  {
    id: "uid",
    accessorFn: (row) => row.uid,
    header: "ไอดีเกม",
    cell: ({ row }) => {
      const uid = row.original.uid;
      return (
        <span
          className={[
            "block max-w-[220px] truncate",
            !uid ? "text-muted-foreground" : "",
          ].join(" ")}
          title={uid ?? "ไม่พบไอดีเกม"}
        >
          {uid ?? "-"}
        </span>
      );
    },
  },

  {
    id: "price",
    accessorFn: (row) => row.price,
    header: "ยอดชำระ",
    cell: ({ row }) => (
      <div className=" font-medium tabular-nums">
        {formatMoney(row.original.price)}
      </div>
    ),
  },

  {
    id: "status",
    accessorKey: "status",
    header: "สถานะคำสั่งซื้อ",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },

  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => <SortHeader title="วันที่" column={column} />,
    cell: ({ row }) => {
      const raw = row.getValue("createdAt");
      const date = raw instanceof Date ? raw : new Date(raw as any);
      return (
        <div className="text-left tabular-nums">
          {format(date, "dd/MM/yyyy HH:mm")}
        </div>
      );
    },
  },

  {
    id: "action",
    header: "จัดการ",
    cell: ({ row }) => (
      <div className="flex justify-start">
        <ViewHistoryBuyOrderButton product={row.original} />
      </div>
    ),
  },
];
