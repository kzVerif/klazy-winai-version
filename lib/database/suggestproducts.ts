"use server";

import { revalidatePath } from "next/cache";
import prisma from "./conn";
import { requireAdmin } from "../requireAdmin";

const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export interface suggestProducts {
  id: string;
  productId: string;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    image: string | null;
    detail: string | null;
    price: number;
    isDiscount: boolean;
    priceDiscount: number;
    isPromotion: boolean;
    buy: number;
    free: number;
    websiteId: string;
    categoryId: string;
    stocks: any[];
  };
}

export async function getAllSuggestProducts() {
  try {
    const suggests = await prisma.suggestProducts.findMany({
      where: {
        websiteId: identifyWebsite,
      },
      include: {
        product: {
          include: {
            stocks: true, // ⬅️ ดึง stocks มาด้วย
          },
        },
      },
    });
    
    return suggests;
  } catch (error) {
    console.log("getAllSuggestProducts Error:", error);
    return [];
  }
}

export async function addSuggestProducts(id: string) {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    await prisma.suggestProducts.create({
      data: {
        productId: id,
        websiteId: identifyWebsite,
      },
    });
    revalidatePath("/admin/suggestproducts");
    revalidatePath("/");
    return {
        success: true,
        message: "เพิ่มการแนะนำสินค้าสำเร็จ",
      };
  } catch (error) {
    console.log("addSuggestProducts Error: ", error);
    return { success: false, message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์" };
  }
}

export async function DeleteSuggestProduct(id: string) {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    await prisma.suggestProducts.delete({
      where: {
        id: id,
        websiteId: identifyWebsite,
      },
    });
    revalidatePath("/admin/suggestproducts");
    revalidatePath("/");
     return {
        success: true,
        message: "ลบหมวดหมู่แนะนำสำเร็จ",
      };
  } catch (error) {
    console.log("DeleteSuggestProduc: ", error);
    return { success: false, message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์" };
  }
}
