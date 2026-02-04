"use server";
import { revalidatePath } from "next/cache";
import prisma from "./conn";
import { requireAdmin } from "../requireAdmin";

const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default_site";

export interface Categories {
  id: string;
  name: string;
  image: string | null;
}

export async function getCategories() {
  try {
    const categories = await prisma.categories.findMany({
      where: { websiteId: identifyWebsite },
      include: {
        Products: true,
      },
    });
    const plainCategories = categories.map((item) => ({
      ...item,
      products: item.Products.map((p) => ({
        ...p,
        price: Number(p.price),
        priceDiscount: Number(p.priceDiscount),
      })),
    }));
    // console.log(plainCategories);

    return plainCategories;
  } catch (error) {
    console.log("getCategories Error: ", error);
    return [];
  }
}

export async function createCategory(data: Categories) {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    const updated = await prisma.categories.create({
      data: {
        name: data.name,
        image: data.image,
        websiteId: identifyWebsite,
      },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/suggestproducts");
    revalidatePath("/categories");
    revalidatePath("/");
    return updated;
  } catch (error) {
    console.log("CreateCategory Error: ", error);
    throw new Error("เกิดข้อผิดพลากจากระบบ");
  }
}

export async function deleteCategory(id: string) {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    const deleted = await prisma.categories.delete({
      where: { id: id, websiteId: identifyWebsite },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/suggestproducts");
    revalidatePath("/categories");
    revalidatePath("/");
    return deleted;
  } catch (error) {
    console.log("deleteCategory Error: ", error);
    throw new Error("เกิดข้อผิดพลากจากระบบ");
  }
}

export async function updateCategory(data: Categories) {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    const updated = await prisma.categories.update({
      where: { id: data.id, websiteId: identifyWebsite },
      data: {
        name: data.name,
        image: data.image,
      },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/suggestproducts");
    revalidatePath("/categories");
    revalidatePath("/");
    return updated;
  } catch (error) {
    console.log("updateCategory Error: ", error);
    throw new Error("เกิดข้อผิดพลาดจากระบบ");
  }
}

export async function getCategoriesById(id: string) {
  try {
    const category = await prisma.categories.findUnique({
      where: {
        id: id,
        websiteId: identifyWebsite,
      },
    });
    return category;
  } catch (error) {
    console.log("getCategoriesById Error");
    return {
      id: "",
      name: "ไม่พบหมวดหมู่ที่ระบุ",
      image: "",
    };
  }
}
