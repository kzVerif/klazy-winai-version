import DailySalesChart from "@/components/Admin/Dashboard/DailySalesChart";
import PieChart from "@/components/Admin/Dashboard/PieChart";
import Top5AppsChart from "@/components/Admin/Dashboard/Top5AppsChart";
import Top5Chart from "@/components/Admin/Dashboard/Top5Chart";
import Top5OrderChart from "@/components/Admin/Dashboard/Top5OrderChart";
import {
  deadStock,
  getMarketingData,
  getSOLDForDashboard,
  getTop5AppPremiums,
  getTop5Orders,
  getTop5Products,
  getTopupForDashboard,
  getWeeklySalesChart,
  revenueRatio,
  richMan,
} from "@/lib/database/Dashboard";

// --- IMPORTS ของเดิม ---
import {
  AddMoneyCircleIcon,
  PackageDelivered01Icon,
} from "@hugeicons/core-free-icons";

// --- IMPORTS ของใหม่ (เพิ่มเข้ามา) ---
import {
  UserMultiple02Icon, // ไอคอนผู้ใช้
  Ticket01Icon, // ไอคอนคูปอง
  UnavailableIcon, // ไอคอนสินค้าหมด/Dead Stock
  ChampionIcon, // ไอคอนถ้วยรางวัล
  MoneyBag02Icon, // ไอคอนถุงเงิน
  UserAdd01Icon, // ไอคอนลูกค้าใหม่
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

export default async function Page() {
  // ==========================================
  // ส่วนที่ 1: การดึงข้อมูล (DATA FETCHING)
  // ==========================================

  // --- [OLD DATA] ข้อมูลเดิมจาก Database ---
  const topup = await getTopupForDashboard();
  const sold = await getSOLDForDashboard();
  const marketingData = await getMarketingData();
  const topSpendersData = await richMan();
  const deadStockData = await deadStock();
  const dailySales = await getWeeklySalesChart();
  const bestSeller = await getTop5Products();
  const top5App = await getTop5AppPremiums();
  const top5Order = await getTop5Orders();
  const revRatio = await revenueRatio();
  // console.log(revRatio);

  // ==========================================
  // ส่วนที่ 2: COMPONENT (อัปเกรดให้รองรับทั้งเก่าและใหม่)
  // ==========================================
  const Card = ({
    icon,
    title,
    value,
    unit,
    // เพิ่ม Props เสริมสำหรับดีไซน์ใหม่ (Optional)
    subValue,
    colorClass = "bg-gray-50", // ถ้าไม่ใส่สี จะใช้สีเทาแบบเดิม
  }: {
    icon: IconSvgElement;
    title: string;
    value: number | string;
    unit: string;
    subValue?: React.ReactNode;
    colorClass?: string;
  }) => (
    <div className="flex items-center bg-white p-5 gap-x-4 rounded-2xl shadow-sm border border-gray-100 h-full">
      {/* ใช้ colorClass เพื่อเปลี่ยนสีพื้นหลังไอคอนได้ */}
      <div className={`text-with-color p-3 rounded-2xl ${colorClass}`}>
        <HugeiconsIcon icon={icon} size={42} />
      </div>
      <div className="flex flex-col w-full">
        <h1 className="text-lg font-medium text-gray-700">{title}</h1>
        <div className="flex items-end gap-1 leading-none mt-1">
          <span className="text-4xl font-bold text-gray-900">{value}</span>
          <span className="text-sm text-gray-500 mb-1">{unit}</span>
        </div>
        {/* ส่วนแสดงผลเพิ่มเติม (เช่น Progress Bar) */}
        {subValue && (
          <div className="mt-2 text-sm text-gray-400">{subValue}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="header-admin container py-8 space-y-10 min-h-screen">
      {/* SECTION 1: TOP PERFORMANCE & REVENUE (เน้นตัวเลขสำคัญที่สุด) */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          สรุปผลประกอบการ
        </h2>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <Card
              icon={AddMoneyCircleIcon}
              title="ยอดเติมเงินวันนี้"
              value={Number(topup.today).toFixed(2)}
              unit="บาท"
            />

            {/* 1. ยอดขายรวมรายวัน (Money) */}
            <Card
              icon={MoneyBag02Icon}
              title="รายได้ขายของวันนี้"
              value={marketingData?.sales.today.toFixed(2) ?? 0}
              unit="บาท"
              colorClass="bg-green-100 text-green-600"
            />

            <Card
              icon={PackageDelivered01Icon}
              title="ยอดขายวันนี้"
              value={sold.today}
              unit="ชิ้น"
            />

            {/* 2. User รายวัน */}
            <Card
              icon={UserMultiple02Icon}
              title="ผู้ใช้สมัครใหม่วันนี้"
              value={marketingData?.users.today ?? 0}
              unit="คน"
              colorClass="bg-blue-100 text-blue-600"
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* [LAYER 2 - NEW] : การ์ดสรุปยอดใหม่ (User / ส่วนลด / รายได้รวม) */}
      {/* ========================================================= */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <Card
            icon={AddMoneyCircleIcon}
            title="ยอดเติมเงินเดือนนี้"
            value={Number(topup.monthly).toFixed(2)}
            unit="บาท"
          />

          <Card
            icon={PackageDelivered01Icon}
            title="ยอดขายเดือนนี้"
            value={sold.monthly ?? 0}
            unit="ชิ้น"
          />

          {/* 3. User ใหม่รายสัปดาห์ */}
          <Card
            icon={UserAdd01Icon}
            title="ลูกค้าสมัครใหม่ (วีคนี้)"
            value={marketingData?.users.thisWeek ?? 0}
            unit="คน"
            colorClass="bg-purple-100 text-purple-600"
          />

          {/* 4. โค้ดส่วนลด */}
          <Card
            icon={Ticket01Icon}
            title="การใช้โค้ดส่วนลด"
            value={`${marketingData?.coupons.display}`}
            unit="ใบ"
            colorClass="bg-orange-100 text-orange-600"
            subValue={
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{
                    width: `${((marketingData?.coupons.used ?? 0) / (marketingData?.coupons.total ?? 1)) * 100}%`,
                  }}
                ></div>
              </div>
            }
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* [LAYER 3 - OLD] : กราฟเดิม (Top 5 Chart / Daily Sales Chart) */}
      {/* ========================================================= */}
      <div className="space-y-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          กราฟสถิติ (Statistics Charts)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <div className="col-span-2">
            <PieChart rev={revRatio} />
          </div>
          <div className="col-span-3">
            <DailySalesChart dailySales={dailySales} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Top5Chart bestSeller={bestSeller} />
          <Top5AppsChart bestSeller={top5App} />
          <Top5OrderChart bestSeller={top5Order} />
        </div>
      </div>

      {/* ========================================================= */}
      {/* [LAYER 4 - NEW] : ตารางข้อมูลใหม่ (Top Spenders / Dead Stock) */}
      {/* ========================================================= */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
          กราฟสถิติ (Statistics Charts)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Top 3 Spenders Table */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <HugeiconsIcon
                icon={ChampionIcon}
                className="text-yellow-500"
                size={24}
              />
              <h3 className="font-semibold text-gray-700">
                Top 3 ลูกค้าเปย์หนัก
              </h3>
            </div>
            <div className="space-y-4">
              {topSpendersData.map((user, idx) => (
                <div
                  key={user.userId}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm
                      ${idx === 0 ? "bg-yellow-400" : idx === 1 ? "bg-gray-400" : "bg-orange-400"}`}
                    >
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.username}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    ฿{user.total_topup.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dead Stock Table */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-red-100">
            <div className="flex items-center gap-2 mb-4">
              <HugeiconsIcon
                icon={UnavailableIcon}
                className="text-red-500"
                size={24}
              />
              <h3 className="font-semibold text-gray-700">
                สินค้า Dead Stock (ไม่มียอดมากกว่า 15 วัน)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">ชื่อสินค้า</th>
                    <th className="px-4 py-3">คงเหลือ</th>
                    <th className="px-4 py-3 rounded-r-lg text-right">
                      ไม่ได้ขายมานาน
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deadStockData.map((item) => (
                    <tr
                      key={item.productId}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {item.product_name}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.amount_stuck} ชิ้น
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium border border-red-100">
                          {item.max_days_stuck} วันแล้ว
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
