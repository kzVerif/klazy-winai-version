"use client";

import { useState } from "react"; // 1. เพิ่ม useState
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Update Type ให้ตรงกับข้อมูลจริงที่เราดึงมา
export interface BestSellerItem {
  productName: string;
  categoryName: string;
  sold_count: number;
  revenue: number;
}

export default function Top5Chart({ bestSeller }: { bestSeller: BestSellerItem[] }) {
  // 2. สร้าง State สำหรับสลับโหมด
  const [mode, setMode] = useState<"sold" | "revenue">("sold");

  const chartData = {
    labels: bestSeller.map((item) => item.productName),
    datasets: [
      {
        label: mode === "sold" ? "จำนวนที่ขาย (ชิ้น)" : "ยอดขายรวม (บาท)",
        // 3. เลือกข้อมูลตามโหมด
        data: bestSeller.map((item) =>
          mode === "sold" ? item.sold_count : item.revenue
        ),
        backgroundColor: [
          "#4ade80", "#facc15", "#3b82f6", "#f87171", "#8b5cf6",
        ],
        borderRadius: 8,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ให้ยืดเต็มความสูง
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        padding: 12,
        cornerRadius: 8,
        displayColors: false, // ซ่อนสีหน้า tooltip
        callbacks: {
          // 4. Custom Tooltip: ให้โชว์ข้อมูลทั้ง 2 อย่างเสมอ ไม่ว่าจะอยู่โหมดไหน
          label: function (context: any) {
            const index = context.dataIndex;
            const item = bestSeller[index];
            
            // จัด Format เงิน
            const moneyFormatter = new Intl.NumberFormat('th-TH', {
                style: 'currency',
                currency: 'THB',
                minimumFractionDigits: 0
            });

            return [
              `ขายได้: ${item.sold_count} ชิ้น`,
              `ยอดขาย: ${moneyFormatter.format(item.revenue)}`
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#374151",
          font: { size: 12 },
          // ตัดคำถ้ายาวเกินไป
          callback: function(val: any, index: number) {
            const label = bestSeller[index].productName;
            return label.length > 10 ? label.substr(0, 10) + '...' : label;
          }
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#f3f4f6",
          borderDash: [4, 4],
        },
        ticks: {
          color: "#6b7280",
          // Custom Ticks Format (เช่น 1000 -> 1k)
          callback: function(value: any) {
             if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
             return value;
          }
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full h-full flex flex-col">
      {/* Header: Title + Toggle Buttons */}
      <div className="flex flex-row justify-between items-center mb-6">
        <h2 className="text-lg font-bold text">Top 5 สินค้าทั่วไปขายดี</h2>
        
        {/* Toggle Switch */}
        <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-medium">
          <button
            onClick={() => setMode("sold")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mode === "sold"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            จำนวนชิ้น
          </button>
          <button
            onClick={() => setMode("revenue")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mode === "revenue"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            ยอดเงิน
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 min-h-[300px]">
        <Bar data={chartData} options={options as any} />
      </div>
    </div>
  );
}