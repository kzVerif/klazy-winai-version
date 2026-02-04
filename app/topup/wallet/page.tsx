import WalletTopup from "@/components/Topup/WalletTopup";

export default function page() {
  return (
    <div className="header container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">เติมเงินเข้าสู่ระบบ</h1>
        <h2 className="text-sm text-gray-500">เติมเงินผ่าน TrueMoney Wallet</h2>
      </div>
      <WalletTopup />
    </div>
  );
}
