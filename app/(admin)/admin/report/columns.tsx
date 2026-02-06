"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "ชื่อรายการสินค้า",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div className="flex flex-col gap-1">
          <span
            className="font-bold text-slate-900 truncate max-w-[200px]"
            title={row.original.name}
          >
            {row.original.name}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                type === "ทั่วไป"
                  ? "bg-blue-100 text-blue-700"
                  : type === "แอปพรีเมียม"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-orange-100 text-orange-700"
              }`}
            >
              {type}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "ยอดขาย",
    cell: ({ row }) => (
      <span className="font-black text-emerald-600 text-lg">
        ฿{Number(row.original.price).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-bold p-0 hover:bg-transparent"
      >
        วันที่ทำรายการ <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-slate-500 tabular-nums">
        <div className="font-medium text-slate-900">
          {format(row.original.createdAt, "dd/MM/yyyy")}
        </div>
        <div className="text-[11px] opacity-70">
          {format(row.original.createdAt, "HH:mm:ss")} น.
        </div>
      </div>
    ),
  },
];
