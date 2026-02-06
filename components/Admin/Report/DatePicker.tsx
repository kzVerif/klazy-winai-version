"use client";

import { useRouter } from "next/navigation";

export function MonthPicker({ currentMonth, currentYear }: { currentMonth: string, currentYear: string }) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = e.target.value;
    // อัปเดต URL เช่น /dashboard?month=05&year=2024
    router.push(`?month=${selectedMonth}&year=${currentYear}`);
  };

  return (
    <select 
      value={currentMonth} 
      onChange={handleChange}
      className="border p-2 rounded-md"
    >
      <option value="1">มกราคม</option>
      <option value="2">กุมภาพันธ์</option>
      {/* ... เพิ่มให้ครบ 12 เดือน */}
    </select>
  );
}