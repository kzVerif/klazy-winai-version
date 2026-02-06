"use server";
import { requireAdmin } from "../requireAdmin";
import prisma from "./conn";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function getAllHistoryDiscountCodes() {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return [];
    }
    const his = await prisma.historyDiscountCode.findMany({
      where: {
        websiteId: identifyWebsite,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        code: {
          select: {
            name: true,
            key: true,
            reward: true,
            isPercent: true
          },
        },
      },
    });    
    return his;
  } catch (error) {
    console.log("Error getAllHistory: ", error);
    return [];
  }
}
