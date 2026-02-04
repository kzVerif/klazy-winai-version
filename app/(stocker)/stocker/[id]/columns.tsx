"use client";
import { ColumnDef } from "@tanstack/react-table";
import { EditStockButton } from "@/components/Admin/Products/Stock/EditStockButton";
import { Badge } from "@/components/ui/badge";
import { DeleteStockButton } from "@/components/Admin/Products/Stock/DeleteStockButton";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Stocks = {
  id: string;
  detail: string;
  status: true | false;
  productId: string;
  websiteId: string;
  createdAt: Date;
  updatedAt: Date;
};

export const columns: ColumnDef<Stocks>[] = [
  {
    accessorKey: "id",
    header: "รหัสสต็อคสินค้า",
  },
  {
    accessorKey: "detail",
    header: "รายละเอียด",
    cell: ({ row }) => (
      <span
        className="block truncate max-w-[200px]"
        title={row.original.detail}
      >
        {row.original.detail}
      </span>
    ),
  },
  {
    id: "status",
    header: "สถานะ",
    cell: ({ row }) => {
      const { status } = row.original;

      return status ? (
        <Badge variant="default" className="bg-emerald-500 text-white">
          {"พร้อมขาย"}
        </Badge>
      ) : (
        <Badge variant="destructive">{"ขายแล้ว"}</Badge>
      );
    },
  },
  {
    id: "actions",
    header: "จัดการ",
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <div className="flex gap-2">
          <EditStockButton stock={stock} />
        </div>
      );
    },
  },
];
