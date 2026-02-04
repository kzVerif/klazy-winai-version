"use server"
import { requireAdmin } from "../requireAdmin";
import { requireUser } from "../requireUser";
import prisma from "./conn";
export interface Wallet {
  id: string;
  feeAvailable: boolean;
  available: boolean;
  phone: string;
}
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function getWalletTopup() {
  try {
    const wallet = await prisma.topupTruemoney.findFirst({where: { websiteId: identifyWebsite }});
    if (!wallet) {
      return {
        id: "",
        phone: "ยังไม่ได้ตั้งค่า",
        feeAvailable: false,
        available: false,
      };
    }
    return wallet;
  } catch (error) {
    console.log("getWalletTopup Error: ", error);
    return {
      id: "",
      phone: "ยังไม่ได้ตั้งค่า",
      feeAvailable: false,
      available: false,
    };
  }
}

export async function updateWalletTopup(data: Wallet) {
  try {
               const canUse = await requireAdmin();
          if (!canUse) {
            return {
              success: false,
              message: "ไม่สำเร็จ"
            }
          }
    const wallet = await getWalletTopup();
    if (wallet.id === "") {
      throw new Error("ไม่พบการตั้งค่า");
    }
    const updated = await prisma.topupTruemoney.update({
      where: { id: wallet.id, websiteId: identifyWebsite },
      data: {
        feeAvailable: data.feeAvailable,
        available: data.available,
        phone: data.phone,
      },
    });
    return updated;
  } catch (error) {
    console.log("updateWakketTopup Error: ", error);
    throw new Error("เกิดข้อผืดพลากจากระบบ");
  }
}
