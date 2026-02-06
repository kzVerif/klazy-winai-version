"use server";
import { requireAdmin } from "../requireAdmin";
import prisma from "./conn";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function getAllHistoryCodes() {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return [];
    }
    const his = await prisma.historyCode.findMany({
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
          },
        },
      },
    });
    console.log(his);
    
    return his;
  } catch (error) {
    console.log("Error getAllHistory: ", error);
    return [];
  }
}
