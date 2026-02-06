"use client";

import { DeleteButton } from "@/components/Admin/Users/DeleteButton";
import { EditButton } from "@/components/Admin/Users/EditButton";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Users = {
  id: string;
  username: string;
  points: number;
  totalPoints: number;
  role: string;
  userClassName: string;
};

export const columns: ColumnDef<Users>[] = [
  {
    id: "username",
    header: "ชื่อผู้ใช้",
    cell: ({ row }) => {
      const user = row.original.username;
      return <div className="pl-2">{user}</div>;
    },
  },
  {
    accessorKey: "points",
    header: "Point",
  },
  {
    accessorKey: "totalPoints",
    header: "ยอดเติมสะสม",
  },
  {
    accessorKey: "userClassName",
    header: "คลาสปัจจุบัน",
  },
  {
    accessorKey: "role",
    header: "ยศ",
    cell: ({ row }) => {
      const user = row.original;
      const role =
        user.role === "admin"
          ? "แอดมิน"
          : user.role === "seller"
            ? "เซลเลอร์"
            : user.role === "stocker"
              ? "สต็อคเกอร์"
              : user.role === "orderer"
                ? "ออเดอร์เรอร์"
                : "ผู้ใช้";
      return (
        <div className="flex gap-2">
          <p>{role}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "จัดการ",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2">
          <EditButton user={user} />
          <DeleteButton id={user.id} />
        </div>
      );
    },
  },
];
