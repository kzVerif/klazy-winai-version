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
  code: { name: string; key: string; reward: number;};
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
    accessorKey: "code.reward",
    header: "มูลค่า",
    cell: ({ row }) => {
      const reward = row.original.code?.reward ?? 0;
      return (
        <div className="font-bold text-green-600">
          {`฿${reward.toLocaleString()}`}
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