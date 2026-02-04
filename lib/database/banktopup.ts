"use server";
import { revalidatePath } from "next/cache";
import prisma from "./conn";
import { requireAdmin } from "../requireAdmin";

const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default_site";

export interface Bank {
  id: string
  bankAccount: string
  bankName: string
  bankProvider: string
  available: boolean
}


export async function updateBankTopup(data: Bank) {
  try {
          const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ"
    }
  }
    const bank = await prisma.topupBank.findUnique({where: { websiteId: identifyWebsite }});
    await prisma.topupBank.update({
      where: { id: bank?.id },
      data: {
        bankAccount: data.bankAccount,
        bankName: data.bankName,
        bankProvider: data.bankProvider,
        available: data.available,
      },
    });
    revalidatePath("/admin/commonsetting")
    revalidatePath("/topup/bank")
    return { success: true };
  } catch (error) {
    console.log("updateBankTopup Error: ", error);
    throw new Error("เกิดข้อผิดพลากจากระบบ");
  }
}

export async function getBankTopup(): Promise<Bank> {
  try {
    const bankData = await prisma.topupBank.findUnique({where: { websiteId: identifyWebsite }});
    if (!bankData) {
      
      return {
        id: "",
        bankAccount: "ไม่พบการตั้งค่า",
        bankName: "ไม่พบการตั้งค่า",
        bankProvider: "ไม่พบการตั้งค่า",
        available: false,
      };
    }

    return bankData;
  } catch (error) {
    console.log("getBankTopup Error: ", error);
    return {
      id: "",
      bankAccount: "ไม่พบการตั้งค่า",
      bankName: "ไม่พบการตั้งค่า",
      bankProvider: "ไม่พบการตั้งค่า",
      available: false,
    };
  }
}

