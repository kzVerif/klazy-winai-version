import { AddPackages } from "@/components/Admin/Orders/Packages/AddPackages";
import { DeleteOrderPackage } from "@/components/Admin/Orders/Packages/DeleteOrderPackage";
import { EditPackages } from "@/components/Admin/Orders/Packages/EditPackage";
import { Badge } from "@/components/ui/badge";
import { getOrderPackageByOrderId } from "@/lib/database/OrderPackages";
import { getOrderProductById } from "@/lib/database/orders";
import Image from "next/image";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const order = await getOrderProductById(id);
  const packages = await getOrderPackageByOrderId(id);

  if (!order) {
    return <div>ไม่พบสินค้าออเดอร์ที่คุณต้องการ</div>;
  }

  return (
    <div className="header-admin space-y-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">จัดการแพ็คเกจ {order.name}</h1>
        <h2 className="text-sm text-gray-500">
          หน้าจัดการแพ็คเกจ {order.name}
        </h2>
      </div>
      {/* ===== Product Hero ===== */}
      <div className="relative">
        <Image
          src={order.image ?? "https://placehold.co/1980x500?text=Steam"}
          width={1980}
          height={500}
          alt={order.name}
          className="h-[280px] w-full rounded-2xl object-cover"
        />

        <div className="mt-4">
          <h1 className="text-2xl text font-bold">{order.name}</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            {order.detail}
          </p>
        </div>
      </div>

      {/* ===== Package Header ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text font-bold">แพ็กเกจทั้งหมด</h2>
        </div>

        <AddPackages id={id} />
      </div>

      {/* ===== Package Grid ===== */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Package Card ตัวอย่าง */}
        {packages && packages.length > 0 ? (
          packages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-xl border bg-background p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-2xl">{pkg.name}</h3>
                {pkg.isDiscount ? (
                  <Badge
                    variant="outline"
                    className="border-green-500 text-green-600"
                  >
                    🔥 ลดราคา
                  </Badge>
                ) : (
                  <Badge variant="secondary">ราคาปกติ</Badge>
                )}
              </div>

              <div className="mt-4 flex justify-between">
                {pkg.isDiscount ? (
                  <div className="flex items-center  gap-2">
                    <h1 className="text-gray-300 line-through text-2xl">
                      {pkg.price}฿
                    </h1>

                    <h1 className="text font-semibold text-2xl">
                      {pkg.priceDiscount}฿
                    </h1>
                  </div>
                ) : (
                  <div className="flex items-center  gap-2">
                    <h1 className="text font-semibold text-2xl">
                      {pkg.price}฿
                    </h1>
                  </div>
                )}
                <div className="flex gap-2">
                  <EditPackages Orderpackage={pkg}/>
                  <DeleteOrderPackage id={pkg.id}/>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground">ไม่พบแพ็คเกจ</div>
        )}
      </div>
    </div>
  );
}
