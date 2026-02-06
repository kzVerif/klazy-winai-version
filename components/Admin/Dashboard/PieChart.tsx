"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register modules
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ rev }: { rev: any }) {
  const data = {
    // กำหนด Labels ให้ชัดเจนขึ้น
    labels: rev.name || ["Normal", "Apps", "Orders"],
    datasets: [
      {
        label: " รายได้ (บาท)",
        data: [rev.revNormal, rev.revApps, rev.revOrders],
        // เปลี่ยนเป็นโทนสี Modern & Vibrant
        backgroundColor: [
          "#6366f1", // Indigo
          "#8b5cf6", // Violet
          "#ec4899", // Pink
        ],
        hoverBackgroundColor: [
          "#4f46e5",
          "#7c3aed",
          "#db2777",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 15, // เพิ่ม Effect เวลาเอาเมาส์ไปชี้ให้ชิ้นเค้กขยายออกมา
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ช่วยให้ควบคุมขนาดผ่าน div พ่อได้ง่ายขึ้น
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true, // เปลี่ยนสัญลักษณ์สี่เหลี่ยมเป็นวงกลมให้ดู Soft ลง
          font: {
            size: 14,
            family: "'Inter', sans-serif",
          },
          color: "#4b5563",
        },
      },
      tooltip: {
        backgroundColor: "#1e293b", // Tooltip สีเข้มแบบ Modern
        padding: 12,
        bodyFont: { size: 14 },
        callbacks: {
          // เพิ่มการใส่ comma ในตัวเลข Tooltip
          label: (context: any) => {
            const value = context.raw || 0;
            return ` ${context.label}: ${value.toLocaleString()} บาท`;
          }
        }
      },
    },
  };

  return (
    <div className="bg-white p-6 shadow-sm border border-slate-100 rounded-3xl transition-all hover:shadow-md h-full">
      <div className="flex flex-col items-center">
        <div className="w-full mb-4">
          <h2 className="text-lg font-bold text">สัดส่วนรายได้ทั้งหมด</h2>
          <p className="text-sm text-slate-500">สรุปข้อมูลรายรับแยกตามช่องทาง</p>
        </div>
        
        {/* คุมความสูงของ Chart */}
        <div className="relative h-[300px] w-full">
          <Pie data={data} options={options} />
        </div>
        
        {/* เพิ่มส่วนสรุปยอดรวม (Optional) */}
        <div className="mt-6 pt-4 border-t border-slate-50 w-full text-center">
          <span className="text-sm text-slate-400">ยอดรวมทั้งหมด: </span>
          <span className="text-xl font-extrabold text">
            {(rev.revNormal + rev.revApps + rev.revOrders).toLocaleString()} ฿
          </span>
        </div>
      </div>
    </div>
  );
}