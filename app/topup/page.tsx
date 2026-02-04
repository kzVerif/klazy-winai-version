"use server";
import { Badge } from "@/components/ui/badge";
import { getBankTopup } from "@/lib/database/banktopup";
import { getTopupCode } from "@/lib/database/topupcode";
import { getWalletTopup } from "@/lib/database/wallettopup";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const truemoney = await getWalletTopup();
  const bank = await getBankTopup();
  const code = await getTopupCode();

  return (
    <div className="container header">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">เติมเงินเข้าสู่ระบบ</h1>
        <h2 className="text-sm text-gray-500">
          เลือกช่องทางการเติมเงินที่ต้องการได้เลย
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* TrueMoney Section */}
        <Link href={truemoney.available ? "/topup/wallet" : "#"}>
          <div className="relative focus cursor-pointer flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
            {/* Badge มุมขวาบน */}
            <Badge
              variant={truemoney.available ? "secondary" : "destructive"}
              className={`absolute top-2 right-2 ${
                truemoney.available
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {truemoney.available ? "ใช้งานได้" : "ปิดใช้งาน"}
            </Badge>

            <Image
              src="/img/True-money.jpg"
              alt="เติมเงินผ่านทรูวอลเลท"
              width={150}
              height={150}
              className="mb-4"
            />
            <h1 className="text-lg font-semibold text-gray-800 mb-2">
              เติมเงินผ่านTrueMoney wallet
            </h1>
            {truemoney.feeAvailable ? (
              <Badge variant="destructive">
                ยอดที่ได้รับจะหักค่าธรรมเนียม 2.9% สูงสุด 20 บาท
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-emerald-500 text-white">
                ไม่มีการหักค่าธรรมเนียม
              </Badge>
            )}
          </div>
        </Link>

        {/* Bank Section */}
        <Link href={bank.available ? "/topup/bank" : "#"}>
          <div className="relative focus cursor-pointer flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
            {/* Badge มุมขวาบน */}
            <Badge
              variant={bank.available ? "secondary" : "destructive"}
              className={`absolute top-2 right-2 ${
                bank.available
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {bank.available ? "ใช้งานได้" : "ปิดใช้งาน"}
            </Badge>

            <Image
              src="/img/slip2.webp"
              alt="เติมเงินผ่านธนาคาร"
              width={150}
              height={150}
              className="mb-4"
            />
            <h1 className="text-lg font-semibold text-gray-800 mb-2">
              เติมเงินผ่านธนาคาร
            </h1>
            <Badge variant="secondary" className="bg-emerald-500 text-white">
              ไม่มีการหักค่าธรรมเนียม
            </Badge>
          </div>
        </Link>

        {/* Code Section */}
        <Link href={code.available ? "/topup/code" : "#"}>
          <div className="relative focus cursor-pointer flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
            {/* Badge มุมขวาบน */}
            <Badge
              variant={code.available ? "secondary" : "destructive"}
              className={`absolute top-2 right-2 ${
                code.available
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {code.available ? "ใช้งานได้" : "ปิดใช้งาน"}
            </Badge>

            <Image
              src="/img/promo-code.png"
              alt="เติมเงินผ่านโค้ด"
              width={150}
              height={150}
              className="mb-4"
            />
            <h1 className="text-lg font-semibold text-gray-800 mb-2">
              เติมเงินผ่านโค้ด
            </h1>
            <Badge variant="secondary" className="bg-emerald-500 text-white">
              ไม่มีการหักค่าธรรมเนียม
            </Badge>
          </div>
        </Link>
      </div>
    </div>
  );
}
