"use client";

import { DeleteDiscountCodeButton } from "@/components/Admin/DiscountCode/DeleteDiscountCodeButton";
import EditDiscountCodeButton from "@/components/Admin/DiscountCode/EditDiscountCodeButton";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DiscountCodes =   {
    id: string,
    name: string,
    key: string,
    isPercent: boolean,
    reward: number,
    currentUse: number,
    maxUse: number,
    canDuplicateUse: boolean,
    normalProduct: boolean,
    appPremiumProduct: boolean,
    orderProduct: boolean,
    createdAt: Date,
    expired: Date,
    websiteId: string
  }

export const columns: ColumnDef<DiscountCodes>[] = [
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
          <EditDiscountCodeButton code={code} />
          <DeleteDiscountCodeButton id={code.id}/>
        </div>
      );
    },
  },
];
