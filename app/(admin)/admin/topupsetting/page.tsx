import BankSettingForm from "@/components/Admin/Topup/BankSettingForm";
import CodeSettinngForm from "@/components/Admin/Topup/CodeSettingForm";
import WalletSettingForm from "@/components/Admin/Topup/WalletSettingForm";
import { Bank, getBankTopup } from "@/lib/database/banktopup";
import { getTopupCode } from "@/lib/database/topupcode";
import { getWalletTopup, Wallet } from "@/lib/database/wallettopup";

export default async function page() {
  const bank: Bank = await getBankTopup()
  const wallet: Wallet = await getWalletTopup()
  const code = await getTopupCode()
  return (
    <div className="header-admin">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">ตั้งค่าการเติมเงิน</h1>
        <h2 className="text-sm text-gray-500">
          จัดการวิธีการเติมเงินของร้านค้า
        </h2>
      </div>
        <WalletSettingForm data={wallet} />
        <BankSettingForm
          data={bank}
        />
        <CodeSettinngForm data={code.available} />
    </div>
  );
}
