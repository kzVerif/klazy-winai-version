import WalletTopup from "@/components/Topup/WalletTopup";

export default function page() {
  return (
    <div className="header container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">เติมเงินเข้าสู่ระบบ</h1>
        <h2 className="text-sm text-gray-500">เติมเงินผ่าน TrueMoney Wallet</h2>
      </div>
      <WalletTopup />
            <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600 leading-relaxed">
          <p>
            โปรดตรวจสอบจำนวนเงินให้ถูกต้องก่อนทำรายการ
            เมื่อเติมเงินหรือโอนเงินเข้าระบบแล้ว ทางระบบขอสงวนสิทธิ์ไม่คืนเงิน
            และไม่ทอนเงินทุกกรณี
          </p>

          <p className="mt-2">
            เพื่อป้องกันปัญหาบัญชีม้าและการทุจริตในรูปแบบต่าง ๆ หากโอนผิดจำนวน
            ถือว่าเป็นความรับผิดชอบของผู้ใช้งาน
          </p>

          <p className="mt-2 text-red-500">
            * ขอสงวนสิทธิ์คืนเงินเฉพาะกรณีที่มีหนังสือหรือเอกสารทางราชการ
            หรือหลักฐานธุรกรรมจากธนาคารเท่านั้น
          </p>
        </div>
    </div>
  );
}
