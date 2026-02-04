"use server";

import { getServerSession } from "next-auth";
import { requireAdmin } from "../requireAdmin";
import prisma from "./conn";
import { authOptions } from "../auth";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function getHistoryBuyAppPremiumByUserId(userId: string) {
  try {
        const session = await getServerSession(authOptions)
        if (userId !== session?.user.id) {
          return []
        }
    const his = await prisma.historyBuyAppPremium.findMany({
      where: {
        userId: userId,
        websiteId: identifyWebsite,
      },
      include: { user: true, appPremium: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    const plainHis = his.map((item) => ({
      ...item,
      price: Number(item.price),
      createdAt: item.createdAt,
      user: {
        ...item.user,
        points: Number(item.user.points),
        totalPoints: Number(item.user.totalPoints),
      },
      appPremium: {
        ...item.appPremium,
        price: Number(item.appPremium.price),
        priceDiscount: Number(item.appPremium.priceDiscount),
      },
    }));
    return plainHis;
  } catch (error) {
    console.log("error getHistoryBuyAppPremium", error);
    return [];
  }
}

export async function getAllHistoryBuyAppPremium() {
        const canUse = await requireAdmin();
  if (!canUse) {
    return []
  }
  try {
    const his = await prisma.historyBuyAppPremium.findMany({
      where: {
        websiteId: identifyWebsite,
      },
      include: { user: true, appPremium: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return his;
  } catch (error) {
    console.log("error getHistoryBuyAppPremium", error);
    return [];
  }
}
