"use client";

import { ViewHistoryBuyButton } from "@/components/Admin/Historybuy/ViewHistoryBuyButton";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type AdminBuyProduct = {
  id: string;
  userId: string;
  stockId: string;
  productId: string;
  createdAt: Date;
  price: number;
  product: {
    categoryId: string;
    detail: string | null;
    id: string;
    image: string | null;
    name: string;
    price: number;
  };
  stock: {
    id: string;
    detail: string;
    status: boolean;
    productId: string;
  };
  user: {
    id: string;
    password: string;
    points: number;
    role: string;
    totalPoints: number;
    username: string;
  };
};

export const columns: ColumnDef<AdminBuyProduct>[] = [
  {
    accessorKey: "id",
    header: "รหัสคำสั่งซื้อ",
  },
  {
    id: "productName",
    accessorFn: (row) => row.product.name,
    header: "ชื่อสินค้า",
    cell: ({ row }) => {
      const name = row.original.product?.name ?? "-";
      return (
        <span className="block max-w-[220px] truncate" title={name}>
          {name}
        </span>
      );
    },
  },
  {
    accessorFn: (row) => row.user.username,
    header: "ผู้ซื้อ",
  },
  {
    accessorFn: (row) => row.price,
    header: "ยอดชำระ",
    cell: ({ row }) => (
      <span className="font-bold text-primary">
        ฿{row.original.price.toLocaleString()}
      </span>
    ),
  },

  {
    accessorKey: "createdAt",
    header: (
      { column }, // 👈 นี่คือส่วน header ที่คุณมีอยู่แล้ว
    ) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-bold cursor-pointer"
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
      const date = new Date(row.getValue("createdAt"));
      const formattedDate = format(date, "dd/MM/yyyy HH:mm");
      return <div className="text-left">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    header: "จัดการ",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex gap-2">
          <ViewHistoryBuyButton product={product} />
        </div>
      );
    },
  },
];
