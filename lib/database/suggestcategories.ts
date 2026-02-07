"use server";
import { revalidatePath } from "next/cache";
import prisma from "./conn";
import { requireAdmin } from "../requireAdmin";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function addSuggestCategories(id: string) {
  try {
            const canUse = await requireAdmin();
      if (!canUse) {
        return {
          success: false,
          message: "ไม่สำเร็จ"
        }
      }
    await prisma.suggestCategories.create({
      data: {
        categoriesId: id,
        websiteId: identifyWebsite,
      },
    });
    revalidatePath("/admin/suggestproducts");
    revalidatePath("/");
    return {
          success: false,
          message: "เพิ่มการแนะนำหมวดหมู่สำเร็จ"
        }
  } catch (error) {
    console.log("addSuggestCategories Error: ", error);
    return { success: false, message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์" };
  }
}

export async function getAllSuggestCategories() {
  try {
    const suggestCategories = await prisma.suggestCategories.findMany({
      where: { websiteId: identifyWebsite },
      include: {
        category: {
          include: {
            Products: true, // 👈 ดึงสินค้าทั้งหมดในหมวดหมู่
          },
        },
      },
    });
    const plainCategories = suggestCategories.map((item) => ({
      ...item,
      amount: item.category.Products.length, // 🍀 นับจำนวนสินค้า
    }));    
    return plainCategories
  } catch (error) {
    console.log("getAllSuggestCategories Error:", error);
    return [];
  }
}

export async function deleteSuggestCategories(id: string) {
  try {
            const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ"
    }
  }
    await prisma.suggestCategories.delete({
      where: { id: id, websiteId: identifyWebsite },
    });
    revalidatePath("/admin/suggestproducts")
    revalidatePath("/")
    return {
      success: true,
      message: "ลบหมวดหมู่แนะนำสำเร็จ"
    }
  } catch (error) {
    console.log("deleteSuggestCategories Error: ", error);
    return { success: false, message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์" };
  }
}
