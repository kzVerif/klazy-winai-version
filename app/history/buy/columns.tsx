"use client";
import { ViewHistoryBuyButton } from "@/components/Admin/Historybuy/ViewHistoryBuyButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // สมมติว่ามี Badge component
import { Copy01Icon, Calendar01Icon, Tag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import toast from "react-hot-toast";

export type BuyProduct = {
  id: string;
  productId: string;
  stockId: string;
  userId: string;
  createdAt: Date;
  price: number
  product: {
    categoryId: string;
    detail: string | null;
    id: string;
    image: string | null;
    name: string;
    price: number;
    isDiscount: boolean;
    priceDiscount: number;
  };
  stock: {
    id: string;
    detail: string;
    status: boolean;
    productId: string;
  };
  user: {
    id: string;
    password: string;
    points: number;
    role: string;
    totalPoints: number;
    username: string;
  };
};

export const columns: ColumnDef<BuyProduct>[] = [
  {
    accessorFn: (row) => row.product.name,
    header: "สินค้า",
    cell: ({ row }) => {
      const { name, image } = row.original.product;
      return (
        <div className="flex items-center gap-3">
          {/* เพิ่มรูปสินค้าเล็กๆ */}
          <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0 border">
             {image ? (
                <img src={image} alt={name} className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                   <HugeiconsIcon icon={Tag01Icon} size={18} className="text-muted-foreground" />
                </div>
             )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm truncate max-w-[180px]" title={name}>
              {name}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.stock.detail,
    header: "รายละเอียด/รหัส",
    cell: ({ row }) => (
      <code className="bg-muted px-2 py-1 rounded text-xs font-mono block truncate max-w-[200px]">
        {row.original.stock.detail}
      </code>
    ),
  },
  {
    accessorFn: (row) => row.price,
    header: "ยอดชำระ",
    cell: ({ row }) => (
      <span className="font-bold text-primary">
        ฿{row.original.price.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-bold -ml-2"
      >
        วันที่ซื้อ
        {/* <Calendar01Icon size={16} className="ml-1" /> */}
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex flex-col text-xs">
          <span className="font-medium">{format(date, "dd MMM yyyy")}</span>
          <span className="text-muted-foreground">{format(date, "HH:mm")} น.</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "จัดการ",
    cell: ({ row }) => {
      const product = row.original;
      console.log();
      
      const onCopyClick = async () => {
        try {
          await navigator.clipboard.writeText(product.stock.detail);
          toast.success("คัดลอกรหัสสินค้าแล้ว");
        } catch (error) {
          toast.error("ไม่สามารถคัดลอกได้");
        }
      };

      return (
        <div className="flex gap-2">
          <ViewHistoryBuyButton product={product} />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onCopyClick} 
            className="transition-colors hover:bg-primary hover:text-white"
            title="คัดลอกรายละเอียด"
          >
            <HugeiconsIcon icon={Copy01Icon}/>
          </Button>
        </div>
      );
    },
  },
];
