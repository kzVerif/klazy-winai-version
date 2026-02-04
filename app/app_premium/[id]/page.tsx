import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import BuyApp from "@/components/AppPremium/BuyApp";
import {
  getAppPremiumById,
  getStatusAppremiumForUser,
} from "@/lib/database/apppremium";
import { getWalletTopup } from "@/lib/database/wallettopup";
import { redirect } from "next/navigation";
export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const res = await fetch(`https://byshop.me/api/product?id=${id}`);
  const product = await res.json();
  const app = await getAppPremiumById(id);
  const tw = await getWalletTopup();

  const statusApp = await getStatusAppremiumForUser();

  if (!statusApp.status) {
    return redirect("/");
  }

  if (!product || product.length === 0 || !app) {
    return (
      <div className="container header text-black">
        <h1 className="text-2xl font-bold text">ไม่พบสินค้า</h1>
        <p className="text-gray-600">ขออภัย ไม่พบสินค้าที่คุณกำลังมองหา</p>
      </div>
    );
  }

  return (
    <div className="container header text-black">
      {/* ✅ ใช้ flex-row บนจอใหญ่ */}
      <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
        {/* ✅ รูปสินค้า */}
        <div className="flex justify-center w-full lg:w-1/2">
          {/* เพิ่ม sticky top เพื่อให้รูปค้างอยู่ตอนเลื่อนอ่านเนื้อหา (Optional UX) */}
          <div className="relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden shadow-md lg:sticky lg:top-4">
            <Image
              src={product[0].img}
              alt={product[0].name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 500px"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2 w-full lg:w-1/2 ">
          {/* <div className="flex flex-col space-y-6 w-full lg:w-1/2 bg-white shadow rounded-2xl px-8 py-4 min-h-screen lg:min-h-[calc(100vh-100px)]"> */}
          <h1 className="text-3xl font-bold text-black wrap-break-word">
            {product[0].name}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">คงเหลือ {product[0].stock} ชิ้น</Badge>
            {product[0].stock <= 0 ? (
              <Badge variant={"destructive"}>ไม่พร้อมจำหน่าย</Badge>
            ) : (
              <Badge className="bg-green-600 text-white text-sm">
                พร้อมจำหน่าย
              </Badge>
            )}
          </div>

          {app.isDiscount ? (
            <div className="space-y-2">
              {/* Badge ลดราคา */}
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 text-white">🔥 กำลังลดราคา</Badge>
                <span className="text-sm text-muted-foreground">
                  ประหยัด {(app.price - app.priceDiscount).toLocaleString()} บาท
                </span>
              </div>

              {/* ราคาหลังลด */}
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text">
                  ฿ {app.priceDiscount.toLocaleString()}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ฿ {app.price.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-4xl font-semibold text-primary">
              ฿ {app.price.toLocaleString()}
            </p>
          )}

          {/* ✅ ฟอร์มกรอกจำนวน */}
          <BuyApp
            remain={product[0].stock}
            productId={app.id}
            price={app.isDiscount ? app.priceDiscount : app.price}
            isDiscount={app.isDiscount}
            priceDiscount={app.priceDiscount}
            feeAvailable={tw.feeAvailable} 
            byshopId={app.byshopId}          
            />

          {/* ✅ รายละเอียดสินค้า */}
          <div className="border-t pt-6 text-black leading-relaxed whitespace-pre-line text-sm sm:text-base">
            <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
            <div
              dangerouslySetInnerHTML={{ __html: product[0].product_info }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
