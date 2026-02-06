"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

export default function DailySalesChart({
  dailySales,
}: {
  dailySales: any;
}) {
  const labels = dailySales.map((d: any) => d.date); // "11-20"
  const values = dailySales.map((d: any) => d.total);

  const chartGradient = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.4)");
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.05)");
    return gradient;
  };

  const data = {
    labels,
    datasets: [
      {
        label: "ยอดขาย (บาท)",
        data: values,
        tension: 0.4,
        borderWidth: 3,
        borderColor: "#3b82f6",
        backgroundColor: (ctx: any) => chartGradient(ctx.chart.ctx),
        fill: true,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full  h-full">
      <h2 className="text-xl font-semibold mb-4 text">ยอดขายรายวัน ของสินค้าทั้งหมด(บาท)</h2>
      <Line data={data} options={options} />
    </div>
  );
}
