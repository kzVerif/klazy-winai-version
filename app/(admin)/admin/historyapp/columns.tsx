"use client";
import { ViewHistoryBuyAppPremiumButton } from "@/components/AppPremium/ViewHistoryBuyAppPremiumButton";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import toast from "react-hot-toast";

export type BuyApp = {
  id: string;
  userId: string;
  info: string;
  appPremiumId: string;
  price: number;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    password: string;
    role: string;
    points: number;
    totalPoints: number;
    createdAt: Date;
  };
  appPremium: {
    id: string;
    name: string;
    price: number;
    isDiscount: boolean;
    priceDiscount: number;
  };
};

export const columns: ColumnDef<BuyApp>[] = [
  // {
  //   accessorKey: "id",
  //   header: "รหัสคำสั่งซื้อ",
  // },
  {
    accessorFn: (row) => row.appPremium.name,
    header: "ชื่อสินค้า",
    cell: ({ row }) => (
      <span
        className="block truncate max-w-[200px]"
        title={row.original.appPremium.name}
      >
        {row.original.appPremium.name}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.user.username,
    header: "ผู้ซื้อ",
    cell: ({ row }) => (
      <span
        className="block truncate max-w-[200px]"
        title={row.original.user.username}
      >
        {row.original.user.username}
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
          await navigator.clipboard.writeText(product.info);
          toast.success("คัดลอกสำเร็จ");
        } catch (error) {
          toast.error("เกิดข้อผิดพลาด");
        }
      };
      // ----------------------------------

      return (
        <div className="flex gap-2">
          {/* เรียกใช้ฟังก์ชันด้านบน */}
          <ViewHistoryBuyAppPremiumButton product={product} />
          {/* <Button variant={"outline"} onClick={onCopyClick} className="cursor-pointer">
            <HugeiconsIcon icon={Copy01Icon} />
          </Button> */}
        </div>
      );
    },
  },
];
