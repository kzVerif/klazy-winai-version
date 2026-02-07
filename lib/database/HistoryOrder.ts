"use server";

import { getServerSession } from "next-auth"; 
import { requireUser } from "../requireUser";
import prisma from "./conn";
import { authOptions } from "../auth";
import { requireOrderer } from "../requireOrderer";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function getHistoryBuyOrdersByUserId(userId: string) {
    const canuse = await requireUser();
  if (!canuse) {
    return []
  }
  try {
    const session = await getServerSession(authOptions);
    if (userId !== session?.user.id) {
      return [];
    }

    const history = await prisma.historyBuyOrderProducts.findMany({
      where: {
        userId,
        websiteId: identifyWebsite,
      },include: {
        orderPackage: true,
      }
    });

    console.log(history);

    return history;
  } catch (error) {
    console.log("Error getAllHistoryBuyOrdersByUserId: ", error);
    return [];
  }
}

export async function getAllHistoryBuyOrders() {
  const canUse = await requireOrderer();
  if (!canUse) {
    return [];
  }
  try {
    const history = await prisma.historyBuyOrderProducts.findMany({
      where: {
        websiteId: identifyWebsite,
      },
      include: {
        user: true,
        orderPackage: true,
        orderProduct: true
      }
    });

    return history;
  } catch (error) {
    console.log("Error getAllHistoryBuyOrders: ", error);
    return [];
  }
}
