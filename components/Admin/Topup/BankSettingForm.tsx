"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { Bank, updateBankTopup } from "@/lib/database/banktopup";

export default function BankSettingForm({ data }: { data:  Bank }) {
  const [enabled, setEnabled] = useState(data.available);
  const [selectedBank, setSelectedBank] = useState(data.bankProvider || "");

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  const accountNumber = String(formData.get("accountNumber") || "");
  const accountName = String(formData.get("accountName") || "");

  const updateData: Bank = {
    id: data.id,
    bankAccount: accountNumber,
    bankName: accountName,
    bankProvider: selectedBank || data.bankProvider,
    available: enabled
  };

  toast.promise(
    updateBankTopup(updateData),
    {
      loading: "กำลังบันทึก...",
      success: "บันทึกการตั้งค่าการเติมเงินผ่านธนาคารสำเร็จ",
      error:   "บันทึกไม่สำเร็จ กรุณาลองใหม่"
    }
  );
};


  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 w-full bg-white border shadow p-4 rounded-2xl"
    >
      <h1 className="text-xl text font-semibold">
        ตั้งค่าการเติมเงินผ่านธนาคาร
      </h1>

      {/* --- สวิตช์เปิด/ปิด --- */}
      <div className="flex items-center space-x-2">
        <Switch
          id="bank-switch"
          checked={enabled}
          onCheckedChange={setEnabled}
          className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300"
        />
        <Label htmlFor="bank-switch">
          {enabled ? (
            <Badge
              variant={"secondary"}
              className="bg-emerald-500 text-white transition-all ease-in-out duration-300"
            >
              เปิดใช้งาน
            </Badge>
          ) : (
            <Badge
              variant={"outline"}
              className="transition-all ease-in-out duration-300"
            >
              ปิดใช้งาน
            </Badge>
          )}
        </Label>
      </div>

      {/* --- เลขบัญชี --- */}
      <div className="grid gap-3">
        <Label htmlFor="accountNumber">เลขที่บัญชี</Label>
        <Input
          id="accountNumber"
          name="accountNumber"
          defaultValue={data.bankAccount}
          placeholder="เช่น 123-456-7890"
        />
      </div>

      {/* --- ชื่อบัญชี --- */}
      <div className="grid gap-3">
        <Label htmlFor="accountName">ชื่อผู้รับเงิน</Label>
        <Input
          id="accountName"
          name="accountName"
          defaultValue={data.bankName}
          placeholder="ชื่อ-นามสกุล"
        />
      </div>

      {/* --- ธนาคาร Selector --- */}
      <div className="grid gap-3">
        <Label htmlFor="bank">ธนาคาร</Label>
        <Select onValueChange={setSelectedBank} defaultValue={data.bankProvider}>
          <SelectTrigger id="bank">
            <SelectValue placeholder="เลือกธนาคาร" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="01002">ธนาคารกรุงเทพ (Bangkok Bank)</SelectItem>
            <SelectItem value="01004">
              ธนาคารกสิกรไทย (Kasikorn Bank)
            </SelectItem>
            <SelectItem value="01006">
              ธนาคารกรุงไทย (Krung Thai Bank)
            </SelectItem>
            <SelectItem value="01011">ธนาคารทหารไทยธนชาต (TTB)</SelectItem>
            <SelectItem value="01014">ธนาคารไทยพาณิชย์ (SCB)</SelectItem>
            <SelectItem value="01025">
              ธนาคารกรุงศรีอยุธยา (Krungsri)
            </SelectItem>
            <SelectItem value="01069">
              ธนาคารเกียรตินาคินภัทร (Kiatnakin)
            </SelectItem>
            <SelectItem value="01022">ธนาคารซีไอเอ็มบีไทย (CIMB)</SelectItem>
            <SelectItem value="01067">ธนาคารทิสโก้ (TISCO)</SelectItem>
            <SelectItem value="01024">ธนาคารยูโอบี (UOB)</SelectItem>
            <SelectItem value="01071">ธนาคารไทยเครดิต (Thai Credit)</SelectItem>
            <SelectItem value="01073">
              ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)
            </SelectItem>
            <SelectItem value="01070">ธนาคารไอซีบีซี (ไทย)</SelectItem>
            <SelectItem value="01098">SME Bank</SelectItem>
            <SelectItem value="01034">
              ธ.เพื่อการเกษตรและสหกรณ์ (BAAC)
            </SelectItem>
            <SelectItem value="01035">
              ธ.เพื่อการส่งออกและนำเข้า (EXIM)
            </SelectItem>
            <SelectItem value="01030">ธนาคารออมสิน (GSB)</SelectItem>
            <SelectItem value="01033">ธนาคารอาคารสงเคราะห์ (GHB)</SelectItem>
            <SelectItem value="01066">ธนาคารอิสลามแห่งประเทศไทย</SelectItem>
            <SelectItem value="02001">PromptPay เบอร์โทรศัพท์</SelectItem>
            <SelectItem value="02003">PromptPay บัตรประชาชน</SelectItem>
            <SelectItem value="02004">PromptPay E-Wallet</SelectItem>
            <SelectItem value="03000">K+ Shop / แม่มณี / Smart Shop</SelectItem>
            <SelectItem value="04000">True Money Wallet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* --- หมายเหตุ --- */}
      <Badge className="text-xs">
        หลังจากตั้งค่าเสร็จแล้วอย่าลืมกด "บันทึกการแก้ไข"
      </Badge>

      <Button type="submit" className="btn-main">
        บันทึกการแก้ไข
      </Button>
    </form>
  );
}
