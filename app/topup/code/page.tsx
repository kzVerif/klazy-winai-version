import CodeTopup from "@/components/Topup/CodeTopup";

export default function page() {
  return (
    <div className="header container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">เติมเงินเข้าสู่ระบบ</h1>
        <h2 className="text-sm text-gray-500">เติมเงินผ่านโค้ด</h2>
      </div>
      <CodeTopup />
    </div>
  );
}
