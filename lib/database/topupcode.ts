"use server";
import { requireAdmin } from "../requireAdmin";
import prisma from "./conn";

const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function getTopupCode() {
  let code = await prisma.topupCode.findFirst({where: { websiteId: identifyWebsite }});

  if (!code) {
    return { available: false };
  }
  return code;
}

export async function updateTopupCode(data: { available: boolean }) {
  try {
            const canUse = await requireAdmin();
      if (!canUse) {
        return {
          success: false,
          message: "ไม่สำเร็จ"
        }
      }
    const updatedCode = await prisma.topupCode.update({
      where: { websiteId: identifyWebsite },
      data: {
        available: data.available,
      },
    });
    return updatedCode;
    
  } catch (error) {
    console.log("Error updating topup code:", error);
    throw error;
  }
}
