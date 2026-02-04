import SettingsForm from "@/components/Admin/Setting/SettingsForm";
import { getShopSettings } from "@/lib/database/setting";


export default async function Page() {
  // ดึงข้อมูลร้านจาก backend/database
  const settings = await getShopSettings();

  return (
    <div className="header-admin">
      <h1 className="text-2xl font-bold text">ตั้งค่าร้านค้า</h1>
      <p className="text-sm text-gray-500 mb-6">
        ปรับแต่งข้อมูลร้านของคุณ เช่น สี โลโก้ และการเชื่อมต่อระบบภายนอก
      </p>
      <SettingsForm initialData={settings} />
    </div>
  );
}
