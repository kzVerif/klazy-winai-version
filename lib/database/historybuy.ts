"use server";
import { getServerSession } from "next-auth";
import { requireUser } from "../requireUser";
import prisma from "./conn";
import { authOptions } from "../auth";
import { requireAdmin } from "../requireAdmin";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function getHistoryBuyByUserId(id: string) {
  try {
      const canuse = await requireUser();
  if (!canuse) {
    return []
  }
    const session = await getServerSession(authOptions);
    if (id !== session?.user.id) {
      return [];
    }
    const historyBuy = await prisma.historyBuy.findMany({
      where: { userId: id, websiteId: identifyWebsite },
      include: {
        user: true,
        stock: true,
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedHistory = historyBuy.map((item) => ({
      ...item,
      price: Number(item.price),
      user: {
        ...item.user,
        points: Number(item.user.points),
        totalPoints: Number(item.user.totalPoints),
      },
      product: {
        ...item.product,
        price: Number(item.product.price),
        priceDiscount: Number(item.product.priceDiscount),
      },
    }));

    return serializedHistory;
  } catch (error) {
    console.error("getHistoryBuyByUserId Error:", error);
    return [];
  }
}

export async function getAllHistoryBuy() {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return [];
    }
    const historyBuy = await prisma.historyBuy.findMany({
      where: { websiteId: identifyWebsite },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        product: true,
        stock: true,
      },
    });
    const mappedData = historyBuy.map((item) => {
      return {
        ...item,
        price: Number(item.product.price),
        user: {
          ...item.user,
          points: Number(item.user.points),
          totalPoints: Number(item.user.totalPoints),
        },
        product: {
          ...item.product,
          price: Number(item.product.price),
          priceDiscount: Number(item.product.priceDiscount),
        },
        stock: {
          ...item.stock,
        },
      };
    });
    return mappedData;
  } catch (error) {
    console.log("getAllHistoryBuy ERROR: ", error);
    return [];
  }
}

