"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, ArrowUp, ArrowDown, TicketPercent, Coins } from "lucide-react";
import { Button } from "@/components/ui/button"; // สมมติว่าใช้ shadcn/ui

export type AllCodes = {
  id: string;
  codeId: string;
  userId: string;
  websiteId: string;
  createdAt: Date;
  user: { username: string };
  code: { name: string; key: string; reward: number; isPercent: boolean };
};

export const columns: ColumnDef<AllCodes>[] = [
  {
    accessorKey: "code.name",
    header: "ชื่อโค้ด",
    cell: ({ row }) => (
      <div className="font-medium max-w-[180px] truncate" title={row.original.code?.name}>
        {row.original.code?.name ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "code.key",
    header: "รหัสโค้ด",
    cell: ({ row }) => (
      <code className="rounded bg-muted px-2 py-1 font-mono text-xs font-bold text-blue-600">
        {row.original.code?.key ?? "-"}
      </code>
    ),
  },
  {
    accessorKey: "user.username",
    header: "ผู้ใช้งาน",
    cell: ({ row }) => <span className="text-sm">{row.original.user?.username}</span>,
  },
  {
    id: "discountType",
    header: "รูปแบบการลด",
    cell: ({ row }) => {
      const isPercent = row.original.code?.isPercent;
      return (
        <div className="flex items-center gap-2">
          {isPercent ? (
            <TicketPercent className="h-4 w-4 text-purple-500" />
          ) : (
            <Coins className="h-4 w-4 text-amber-500" />
          )}
          <span className="text-sm">{isPercent ? "เปอร์เซ็นต์" : "ส่วนลดคงที่"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "code.reward",
    header: "มูลค่าที่ลด",
    cell: ({ row }) => {
      const reward = row.original.code?.reward ?? 0;
      const isPercent = row.original.code?.isPercent;
      return (
        <div className="font-bold text-green-600">
          {isPercent ? `${reward}%` : `฿${reward.toLocaleString()}`}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 font-bold hover:bg-transparent"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          วันที่ใช้
          {isSorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm text-muted-foreground tabular-nums">
          {format(date, "dd/MM/yyyy HH:mm")}
        </div>
      );
    },
  },
];