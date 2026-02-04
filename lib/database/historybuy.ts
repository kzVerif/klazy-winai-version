"use server";
import { getServerSession } from "next-auth";
import { requireUser } from "../requireUser";
import prisma from "./conn";
import { authOptions } from "../auth";
import { requireAdmin } from "../requireAdmin";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function getHistoryBuyByUserId(id: string) {
  try {
    await requireUser();
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
      return []
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

export async function getSOLDForDashboard() {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
        today: 0,
        monthly: 0,
      };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const todaySOLD = await prisma.historyBuy.aggregate({
      _count: { _all: true },
      where: {
        createdAt: { gte: today },
        websiteId: identifyWebsite,
      },
    });

    const monthlySOLD = await prisma.historyBuy.aggregate({
      _count: { _all: true },
      where: {
        createdAt: { gte: firstDayOfMonth },
        websiteId: identifyWebsite,
      },
    });

    return {
      today: todaySOLD._count._all || 0,
      monthly: monthlySOLD._count._all || 0,
    };
  } catch (error) {
    console.error("getSOLDForDashboard Error:", error);
    return { today: 0, week: 0 };
  }
}

export async function getBestSellerProducts() {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return [{
        success: false,
        message: "ไม่สำเร็จ",
      }];
    }
    // จัดกลุ่มตาม productId แล้วนับจำนวนการซื้อ
    const bestSellers = await prisma.historyBuy.groupBy({
      where: { websiteId: identifyWebsite },
      by: ["productId"],
      _count: {
        productId: true,
      },
      orderBy: {
        _count: {
          productId: "desc",
        },
      },
      take: 5, // เอาแค่ 5 อันดับ
    });

    // เอา productId ไปดึงข้อมูลสินค้าอีกที
    const products = await Promise.all(
      bestSellers.map(async (item) => {
        const product = await prisma.products.findUnique({
          where: { id: item.productId, websiteId: identifyWebsite },
        });

        if (!product) return null;

        return {
          ...product,
          price: Number(product.price), // ✅ แปลง Decimal → Number
          priceDiscount: Number(product.priceDiscount), // ✅ แปลง Decimal → Number
          sold: item._count.productId,
        };
      }),
    );

    return products;
  } catch (error) {
    console.error("getBestSellerProducts Error:", error);
    return [];
  }
}

export async function getLast7DaysDailyRevenue() {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return [{
        success: false,
        message: "ไม่สำเร็จ",
      }];
    }
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // รวมวันนี้เป็น 7 วัน

    // ดึง historyBuy ย้อนหลัง 7 วัน พร้อมราคาสินค้า
    const records = await prisma.historyBuy.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        websiteId: identifyWebsite,
      },
      include: {
        product: true, // จะได้ product.price มาเลย
      },
    });

    // สร้าง object เก็บยอดขายรายวัน
    const dailyRevenue: Record<string, number> = {};

    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(sevenDaysAgo.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      dailyRevenue[dateStr] = 0;
    }

    // รวมยอดขายแต่ละวัน
    records.forEach((order) => {
      const dateStr = order.createdAt.toISOString().split("T")[0];
      const price = Number(order.product.price);

      if (dailyRevenue[dateStr] !== undefined) {
        dailyRevenue[dateStr] += price;
      }
    });

    const result = Object.entries(dailyRevenue).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    return result;
  } catch (error) {
    console.error("getLast7DaysDailyRevenue Error:", error);
    return [];
  }
}
