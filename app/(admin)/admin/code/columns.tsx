"use client";

import { DeleteCodeButton } from "@/components/Admin/Code/DeleteCodeButton";
import EditCodeButton from "@/components/Admin/Code/EditCodeButton";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AllCodes = {
    id: string;
    name: string;
  key: string;
  reward: number;
  currentUse:number;
  maxUse: number;
  createdAt: Date;
  expired: Date;
  canDuplicateUse: boolean
    
};

export const columns: ColumnDef<AllCodes>[] = [
  {
    accessorKey: "name",
    header: "ชื่อโค้ด",
  },
  {
    accessorKey: "reward",
    header: "จำนวนเงิน",
  },{
    accessorKey: "currentUse",
    header: "จำนวนครั้งที่ใช้แล้ว",
  },{
    accessorKey: "maxUse",
    header: "จำนวนครั้งสูงสุด",
  },
    {
    accessorKey: "expired",
    header: (
      { column } // 👈 นี่คือส่วน header ที่คุณมีอยู่แล้ว
    ) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        วันที่หมดอายุ{" "}
        {column.getIsSorted() === "asc"
          ? "↑"
          : column.getIsSorted() === "desc"
          ? "↓"
          : ""}
      </button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("expired"));
      const formattedDate = format(date, "dd/MM/yyyy HH:mm");
      return <div className="text-left">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    header: "จัดการ",
    cell: ({ row }) => {
      const code = row.original;
      return (
        <div className="flex gap-2">
          <EditCodeButton code={code} />
          {/* <ViewHistoryTopupButton topupHis={topupHis} /> */}
          <DeleteCodeButton id={code.id}/>
        </div>
      );
    },
  },
];
