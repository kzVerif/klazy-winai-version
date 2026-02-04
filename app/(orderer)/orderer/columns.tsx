"use client";

import { ViewHistoryBuyOrderButton } from "@/components/Admin/HistoryOrder/ViewHistoryBuyOrderButton";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type OderProductAdmin = {
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
  user: {
    id: string;
    username: string;
    password: string;
    role: string;
    points: number;
    totalPoints: number;
    createdAt: Date;
    websiteId: string;
    userClassName: string;
    classId: string
  };
  orderProduct: {
    id: string;
    name: string;
    image: string | null;
    detail: string | null;
    websiteId: string;
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
  }).format(n);

export const columns: ColumnDef<OderProductAdmin>[] = [
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
            "block max-w-[200px] truncate",
            !uid ? "text-muted-foreground" : "",
          ].join(" ")}
          title={uid ?? "ไม่พบไอดีเกม"}
        >
          {uid ?? "ไม่พบไอดีเกม"}
        </span>
      );
    },
  },

  {
    id: "price",
    accessorFn: (row) => row.price,
    header: "ยอดชำระ",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {formatMoney(row.original.price)}
      </span>
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
    header: ({ column }) => (
      <button
        type="button"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-bold cursor-pointer select-none hover:opacity-80"
      >
        วันที่{" "}
        {column.getIsSorted() === "asc"
          ? "↑"
          : column.getIsSorted() === "desc"
          ? "↓"
          : ""}
      </button>
    ),
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
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex justify-start gap-2">
          <ViewHistoryBuyOrderButton product={product} />
        </div>
      );
    },
  },
];
