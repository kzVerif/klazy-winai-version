"use client";

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

export interface BestSeller {
  product: {
    id: string;
    name: string;
    image: string | null;
    detail: string | null;
    price: number;
    categoriesId: string;
  };
  sold: number;
}

export default function Top5Chart({ bestSeller }: { bestSeller: any }) {
  const chartData = {
    labels: bestSeller.map((item: any) => item.name),
    datasets: [
      {
        label: "ยอดขาย",
        data: bestSeller.map((item: any) => item.sold),
        backgroundColor: [
          "#4ade80",
          "#facc15",
          "#3b82f6",
          "#f87171",
          "#8b5cf6",
        ],
        borderRadius: 8,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#374151",
          font: { size: 13 },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#e5e7eb",
          borderDash: [4, 4],
        },
        ticks: {
          color: "#6b7280",
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-semibold mb-4 text">Top 5 สินค้าขายดี</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
