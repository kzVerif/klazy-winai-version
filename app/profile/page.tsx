import UpgradeRank from "@/components/Profile/UpgradeRank";
import { authOptions } from "@/lib/auth";
import { getAllClassRank } from "@/lib/database/Class";
import { getUserById } from "@/lib/database/users";
import { User, Shield, Calendar, ArrowRight, Lock } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type UserProfile = {
  id: string;
  username: string;
  role: string;
  points: number;
  totalPoints: number;
  userClassName: string;
  createdAt: Date;
  classId: string; // <-- ระบุชัดเจนว่าต้องมี
};
export default async function UserProfilePage() {
  // 1. จำลองข้อมูล User (ดึงจริงจาก DB)
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/");
  }
  const user: UserProfile = await getUserById(session.user.id);

  if (!user) {
    return <div className="header container">ไม่พบข้อมูล</div>;
  }

  const allClasses = await getAllClassRank();

  // 3. Logic หาตำแหน่ง Class ปัจจุบัน และถัดไป
  const currentClassIndex = allClasses.findIndex((c) => c.id === user.classId);

  // ตัด Array เอาเฉพาะ: [Current, Next 1, Next 2]
  // ตรวจสอบ array bounds เพื่อไม่ให้ error กรณีเป็นคลาสสูงสุดแล้ว
  const displayClasses = allClasses.slice(
    currentClassIndex,
    currentClassIndex + 3,
  );

  return (
    <div className="header container p-4 md:p-8 flex justify-center">
      <div className="max-w-4xl w-full space-y-6">
        {/* --- Section 1: User Header --- */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center md:items-start gap-6 border border-gray-100">
          {/* Avatar Area */}
          <div className="h-24 w-24 rounded-full border flex items-center justify-center text-black shadow-lg">
            <User size={40} />
          </div>

          {/* Info Area */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center  md:justify-start gap-3">
              <h1 className="text-2xl font-bold text-gray-800">
                {user.username}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
              >
                {user.role.toUpperCase()}
              </span>
            </div>

            <p className="text-gray-500 font-medium flex items-center md:justify-start gap-2">
              <Shield size={16} className="text-indigo-500" />
              Class:{" "}
              <span className="text-indigo-600 font-bold">
                {user.userClassName}
              </span>
            </p>

            <p className="text-gray-400 text-sm flex items-center md:justify-start gap-2">
              <Calendar size={14} />
              สมัครสมาชิกเมื่อ:{" "}
              {user.createdAt.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* --- Section 2: Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">ยอดเงินคงเหลือ</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {user.points.toLocaleString()}
              </h3>
              <p className="text-xs text-green-500 mt-1">
                ยอดเงินที่ใช้ซื้อของได้
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">ยอดเติมเงินสะสม</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {user.totalPoints.toLocaleString()}
              </h3>
              <p className="text-xs text-blue-500 mt-1">
                ยอดเติมเงินสะสมสำหรับอัปเกรด
              </p>
            </div>
          </div>
        </div>

        {/* --- Section 3: Class Progression (The Core Request) --- */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              เส้นทางการเลื่อนระดับ (Class Journey)
            </h2>
            <p className="text-sm text-gray-500">
              คุณต้องสะสมยอดยอดเติมเงินสะสมเพื่อปลดล็อกระดับถัดไป
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayClasses.map((item, index) => {
              const isCurrent = item.id === user.classId;
              const isLocked = item.upgrade > user.totalPoints;

              // คำนวณ Progress ของ User เทียบกับ Class ถัดไป
              const needPoints = item.upgrade - user.totalPoints;

              return (
                <div
                  key={item.id}
                  className={`relative p-5 rounded-xl border-2 transition-all duration-300 ${
                    isCurrent
                      ? "border-indigo-500 shadow-md transform scale-105 z-10"
                      : "border-gray-100 bg-white opacity-90"
                  }`}
                >
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-3">
                    {isCurrent ? (
                      <span className="bg-green-100 text-green-900 text-xs px-2 py-1 rounded-md">
                        ระดับปัจจุบัน
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-400 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        <Lock size={12} /> Locked
                      </span>
                    )}
                  </div>

                  {/* Class Name */}
                  <h3
                    className={`font-bold text-lg ${isCurrent ? "text-indigo-700" : "text-gray-600"}`}
                  >
                    {item.className}
                  </h3>

                  {/* Reward Info */}
                  <p className="text-sm text-gray-500 mb-4">
                    ส่วนลด:{" "}
                    <span className="font-medium text-green-600">
                      {item.reward}
                      {item.isPercent ? "%" : " บาท"}
                    </span>
                  </p>

                  {/* Progress Info */}
                  <div className="pt-3 border-t border-gray-100">
                    {isCurrent ? (
                      <p className="text-xs text-indigo-600 font-medium">
                        คุณอยู่ในระดับนี้
                      </p>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400">ต้องการอีก</p>
                        <p className="text-sm font-bold text-gray-700">
                          {needPoints.toLocaleString()}{" "}
                          <span className="text-xs font-normal">แต้ม</span>
                        </p>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                          <div
                            className="bg-gray-400 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min((user.totalPoints / item.upgrade) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Fallback ถ้าไม่มี Class ถัดไปแล้ว */}
            {displayClasses.length === 1 && (
              <div className="col-span-2 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                <p>คุณอยู่ในระดับสูงสุดแล้ว!</p>
              </div>
            )}
          </div>
        </div>
            {/* <UpgradeRank id={session.user.id} /> */}
      </div>
    </div>
  );
}
