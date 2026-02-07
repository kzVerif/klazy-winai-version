"use server";
import { getBankTopup } from "../database/banktopup";
import axios from "axios";

export async function TopupBank(qrCode: string) {
  try {
    const bank = await getBankTopup();

    const endpoint = "https://connect.slip2go.com/api/verify-slip/qr-code/info";

    // --- 1. Payload ---
    const payload = {
      payload: {
        qrCode: qrCode,
        checkCondition: {
          checkDuplicate: true,
          checkReceiver: [
            {
              accountType: bank.bankProvider,
              accountNameTH: bank.bankName || undefined,
              accountNumber: bank.bankAccount || undefined,
            },
          ],
        },
      },
    };

    // --- 4. ส่ง Axios ---
    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${process.env.SECRET_KEY_SLIP2GO}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Slip2Go Error:", error.response.data);
      return {
      status: false,
      reason: error.response.data,
    };
    }
    console.error("Network Error:", error.message);
     return {
      status: false,
      reason: "ไม่สามารตติดต่อกับ server ได้",
    };
  }
}
