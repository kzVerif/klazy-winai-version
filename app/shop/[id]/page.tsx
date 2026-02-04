import { getProductById } from "@/lib/database/shop";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import BuyForm from "@/components/Product/BuyForm";
import { getWalletTopup } from "@/lib/database/wallettopup";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await getProductById(id);
  const wallet = await getWalletTopup();

  if (product === null) {
    return <div>ไม่พบสินค้าที่ต้องการ</div>;
  }

  return (
    <div className="container header text-black">
      {/* ✅ ใช้ flex-row บนจอใหญ่ */}
      <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
        {/* ✅ รูปสินค้า */}
        <div className="flex justify-center w-full lg:w-1/2">
          {/* เพิ่ม sticky top เพื่อให้รูปค้างอยู่ตอนเลื่อนอ่านเนื้อหา (Optional UX) */}
          <div className="relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden shadow-md lg:sticky lg:top-4 ">
            <Image
              src={product.image ?? ""}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 500px"
              priority
            />
          </div>
        </div>

        {/* ✅ รายละเอียดสินค้า */}
        {/* แก้ไข: เปลี่ยน h-screen เป็น min-h-screen 
            หรือใช้ min-h-[calc(100vh-2rem)] เพื่อเผื่อระยะขอบ
        */}
        <div className="flex flex-col space-y-6 w-full lg:w-1/2 ">
          {/* <div className="flex flex-col space-y-6 w-full lg:w-1/2 bg-white shadow rounded-2xl px-8 py-4 min-h-screen lg:min-h-[calc(100vh-100px)]"> */}
          <h1 className="text-3xl font-bold text-black wrap-break-word">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">
              คงเหลือ {product.stocks.length} ชิ้น
            </Badge>
            {product.stocks.length <= 0 ? (
              <Badge variant={"destructive"}>ไม่พร้อมจำหน่าย</Badge>
            ) : (
              <Badge className="bg-green-600 text-white text-sm">
                พร้อมจำหน่าย
              </Badge>
            )}
          </div>
          {product.isDiscount ? (
            <div className="space-y-2">
              {/* Badge ลดราคา */}
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 text-white">🔥 กำลังลดราคา</Badge>
                <span className="text-sm text-muted-foreground">
                  ประหยัด{" "}
                  {(product.price - product.priceDiscount).toLocaleString()} บาท
                </span>
              </div>

              {/* ราคาหลังลด */}
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text">
                  ฿ {product.priceDiscount.toLocaleString()}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ฿ {product.price.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-4xl font-semibold text-primary">
              ฿ {product.price.toLocaleString()}
            </p>
          )}

          {/* ✅ ฟอร์มกรอกจำนวน */}
          <BuyForm
            remain={product.stocks.length}
            productId={product.id}
            price={product.price}
            isDiscount={product.isDiscount}
            priceDiscount={product.priceDiscount}
            feeAvailable={wallet.feeAvailable}
          />

          {/* ✅ รายละเอียดสินค้า */}
          <div className="border-t pt-6 text-black leading-relaxed whitespace-pre-line text-sm sm:text-base">
            <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: product.detail ?? "ไม่มีรายละเอียดสินค้า",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
