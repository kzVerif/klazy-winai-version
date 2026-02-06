"use server";
import { getServerSession } from "next-auth";
import { requireUser } from "../requireUser";
import prisma from "./conn";
import { authOptions } from "../auth";
import { requireAdmin } from "../requireAdmin";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function getHistoryTopupByUserId(id: string) {
  try {
    await requireUser()
        const session = await getServerSession(authOptions)
        if (id !== session?.user.id) {
          return []
        }
    const historytopup = await prisma.historyTopup.findMany({
      where: { userId: id, websiteId: identifyWebsite },
    });

    const plainHistoryTopup = historytopup.map(item => ({
      ...item,
      amount: Number(item.amount),
    }));
    return plainHistoryTopup;
  } catch (error) {
    console.error("getHistoryTopupByUserId Error:", error);
    return [];
  }
}


export async function getAllHistoryTopup() {
  try {
            const canUse = await requireAdmin();
      if (!canUse) {
        return []
      }
    const historyTopup = await prisma.historyTopup.findMany({
      where: { websiteId: identifyWebsite },
      include: {
        user: true,
      }
    })
    const mapHistoryTopup = historyTopup.map((item) => {
      return {
        ...item,
        amount: Number(item.amount),
        user: {
          ...item.user,
          points: Number(item.user.points),
          totalPoints: Number(item.user.totalPoints)
        }
      }
    })

    // console.log(mapHistoryTopup);
    

    return mapHistoryTopup
  } catch (error) {
    console.error("getAllHistoryTopup Error:", error);
    return [];
  }
}
