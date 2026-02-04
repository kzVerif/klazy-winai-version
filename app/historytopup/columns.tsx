"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type TopupHis = {
  id: string;
  topupType: string;
  reason: string;
  createdAt: Date;
  amount: number;
  userId: string;
};

export const columns: ColumnDef<TopupHis>[] = [
  {
    accessorKey: "id",
    header: "รหัสการเติมเงิน",
  },
  {
    accessorKey: "amount",
    header: "จำนวนเงิน",
  },
  {
    accessorKey: "reason",
    header: "หมายเหตุ",
  },
  {
    id: "topupType",
    header: "ประเภท",
    cell: ({ row }) => {
      const { topupType } = row.original;

      if (topupType === "Admin") {
        return (
          <Badge variant="destructive" className="bg-red-600 text-white">
            {topupType}
          </Badge>
        );
      }

      if (topupType === "Truemoney") {
        return (
          <Badge variant="secondary" className="bg-amber-600 text-white">
            {topupType}
          </Badge>
        );
      }

      return (
        <Badge variant="default" className="bg-blue-500 text-white">
          {topupType}
        </Badge>
      );
    },
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
];
