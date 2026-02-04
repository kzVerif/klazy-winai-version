import { AddOrdersProduct } from "@/components/Admin/Orders/AddOrdersProduct";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getAllOrderProducts, getOrderSettingForAdmin } from "@/lib/database/orders";
import { EditOrderProduct } from "@/components/Admin/Orders/EditOrderProduct";
import { DeleteOrderProduct } from "@/components/Admin/Orders/DeleteOrderProduct";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PackageIcon } from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OrderSettingsForm from "@/components/Admin/Orders/OrderSettingsForm";

export default async function page() {
  const orders = await getAllOrderProducts();
  const orderSetting = await getOrderSettingForAdmin();
  
  return (
    <div className="header-admin container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">จัดการสินค้าออเดอร์</h1>
        <h2 className="text-sm text-gray-500">
          หน้าจัดการสินค้าออเดอร์ทั้งหมดของร้านค้า
        </h2>
      </div>
      <OrderSettingsForm data={orderSetting}/>
      <div className="flex items-end justify-end mb-4">
        <AddOrdersProduct />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="rounded-xl border bg-white cursor-pointer"
          >
            <CardContent className="flex flex-col items-start justify-center gap-3">
              <div className="w-full rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={order.image ?? ""}
                  width={1980}
                  height={500}
                  alt={`สินค้า ${order.name}`}
                  className="w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="font-semibold">{order.name}</h3>
                </div>
                <div className="flex gap-2">
                  <EditOrderProduct order={order} />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button
                          variant="outline"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <HugeiconsIcon icon={PackageIcon} />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>เพิ่มแพ็คเกจ</p>
                    </TooltipContent>
                  </Tooltip>

                  <DeleteOrderProduct id={order.id} />
                  
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
