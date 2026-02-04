import { Card, CardContent } from "@/components/ui/card";
import { getAllClassRank } from "@/lib/database/Class";
import { Badge } from "@/components/ui/badge"; // สมมติว่ามี shadcn badge
import { Layers, TrendingUp, Percent, Gift } from "lucide-react"; // ใช้ lucide-react สำหรับ icon
import { AddClassRankButton } from "@/components/Admin/ClassRank/AddClassRankButton";
import { DeleteClassRankButton } from "@/components/Admin/ClassRank/DeleteClassRankButton";
import { EditClassRankButton } from "@/components/Admin/ClassRank/EditClassRankButton";

export default async function Page() {
  const data = await getAllClassRank();

  return (
    <div className="header-admin">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text">
            จัดการระบบคลาส
          </h1>
          <h2 className="text-sm text-gray-500">
            ปรับแต่งและดูแลลำดับขั้นคลาสทั้งหมดในระบบของคุณ
          </h2>
        </div>
        <AddClassRankButton />
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item: any) => (
          <Card
            key={item.id}
            className="overflow-hidden border transition-all duration-300 bg-white group"
          >
            <CardContent className="p-6">
              {/* Class Name */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Layers className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-xl text-slate-800">
                    {item.className}
                  </h3>
                </div>
                <Badge
                  variant={item.isPercent ? "default" : "secondary"}
                  className="rounded-md"
                >
                  {item.isPercent ? "เปอร์เซ็นต์" : "ค่าคงที่"}
                </Badge>
              </div>

              <div className="space-y-4">
                {/* Upgrade Requirement */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    <span>เกณฑ์ในการอัปเกรด</span>
                  </div>
                  <span className="font-semibold text-slate-700">
                    {item.upgrade.toLocaleString()} ฿
                  </span>
                </div>

                {/* Reward / Discount */}
                <div className="flex items-center justify-between text-sm p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Gift className="w-4 h-4 text-pink-500" />
                    <span>ส่วนลดที่ได้รับ</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-lg text-pink-600">
                    {item.reward}
                    {item.isPercent ? (
                      <Percent className="w-4 h-4" />
                    ) : (
                      <span className="text-xs ml-1">฿</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-2">
                <EditClassRankButton rank={item} />

                {!item.id.startsWith(`rank-`) && (
                  <DeleteClassRankButton id={item.id} />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (Optional) */}
      {data.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl">
          <p className="text-gray-400">ยังไม่มีข้อมูลคลาสในระบบ</p>
        </div>
      )}
    </div>
  );
}
