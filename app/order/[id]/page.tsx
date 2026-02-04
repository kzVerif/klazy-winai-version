import NoPackagePage from "@/components/order/NoPackagePage";
import OrderPage from "@/components/order/OrderPage";
import { getOrderPackageByOrderId } from "@/lib/database/OrderPackages";
import { getOrderProductById } from "@/lib/database/orders";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const packages = await getOrderPackageByOrderId(id);
  if (packages?.length === 0 || packages === null) {
    return <NoPackagePage/>
  } 
  const order = await getOrderProductById(packages[0].orderProductId)

  return (
    <div className="container header">
      {/* รูปสินค้า */}
      <div className="w-full overflow-hidden rounded-xl shadow-md">
        <img
          src={order?.image ?? ""}
          alt={order?.name}
          className="object-cover"
        />
      </div>

      {/* รายละเอียดสินค้า */}
      <h1 className="text-3xl font-bold text">{order?.name}</h1>

      <div className="text-neutral-800">
        {order?.detail}
      </div>

      {/* กรอกข้อมูล + เลือกแพ็ค */}
      <OrderPage packages={packages ?? []} />
    </div>
  );
}
