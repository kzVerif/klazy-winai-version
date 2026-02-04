"use client";
import { ViewHistoryBuyButton } from "@/components/Admin/Historybuy/ViewHistoryBuyButton";
import { Button } from "@/components/ui/button";
import { Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import toast from "react-hot-toast";

export type BuyProduct = {
  id: string;
  productId: string;
  stockId: string;
  userId: string;
  createdAt: Date;
  product: {
    categoryId: string;
    detail: string | null;
    id: string;
    image: string | null;
    name: string;
    price: number;
    isDiscount: boolean;
    priceDiscount: number;
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

export const columns: ColumnDef<BuyProduct>[] = [
  {
    accessorFn: (row) => row.product.name,
    header: "ชื่อสินค้า",
    cell: ({ row }) => (
      <span
        className="block truncate max-w-[200px]"
        title={row.original.product.name}
      >
        {row.original.product.name}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.stock.detail,
    header: "รายละเอียด",
    cell: ({ row }) => (
      <span
        className="block truncate max-w-[200px]"
        title={row.original.stock.detail}
      >
        {row.original.stock.detail}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: (
      { column } // 👈 นี่คือส่วน header ที่คุณมีอยู่แล้ว
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
    accessorKey: "action",
    header: "จัดการ",
    cell: ({ row }) => {
      const product = row.original;
      const onCopyClick = async () => {
        try {
          await navigator.clipboard.writeText(product.stock.detail);
          toast.success("คัดลอกสำเร็จ");
        } catch (error) {
          toast.error("เกิดข้อผิดพลาด");
        }
      };
      // ----------------------------------

      return (
        <div className="flex gap-2">
          {/* เรียกใช้ฟังก์ชันด้านบน */}
          <ViewHistoryBuyButton product={product} />
          <Button variant={"outline"} onClick={onCopyClick} className="cursor-pointer">
            <HugeiconsIcon icon={Copy01Icon} />
          </Button>
        </div>
      );
    },
  },
];
