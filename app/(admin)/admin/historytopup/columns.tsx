"use client";

import { ViewHistoryTopupButton } from "@/components/Admin/็Historytopup/ViewHistoryTopupButton";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AdminTopupHis = {
  id: string;
  amount: number;
  reason: string;
  topupType: string;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    username: string;
    password: string;
    role: string;
    points: number;
    totalPoints: number;
  };
};

export const columns: ColumnDef<AdminTopupHis>[] = [
  {
    accessorKey: "id",
    header: "รหัสการเติมเงิน",
  },
  {
    accessorFn: (row) => row.user.username,
    header: "ผู้ใช้",
  },
  {
    accessorKey: "amount",
    header: "จำนวนเงิน",
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
  {
    id: "actions",
    header: "จัดการ",
    cell: ({ row }) => {
      const topupHis = row.original;
      return (
        <div className="flex gap-2">
          <ViewHistoryTopupButton topupHis={topupHis} />
        </div>
      );
    },
  },
];
