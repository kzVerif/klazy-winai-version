"use server";
import { Stocks } from "@/app/(admin)/admin/products/[id]/columns";
import prisma from "./conn";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "../requireAdmin";
import { requireStocker } from "../requireStocker";

const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function getStocksByProductId(id: string) {
  try {
    const canUse = await requireStocker();
    if (!canUse) {
      return []
    }
    const stocks = await prisma.stocks.findMany({
      where: { productId: id, websiteId: identifyWebsite },
    });
    if (!stocks) {
      return [];
    }
    return stocks;
  } catch (error) {
    console.log("getStocksByProductId Error: ", error);
    return [];
  }
}

export async function updateStocksById(data: Stocks) {
  try {
    const canUse = await requireStocker();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    await prisma.stocks.update({
      where: { id: data.id, websiteId: identifyWebsite },
      data: {
        detail: data.detail,
        status: data.status,
        productId: data.productId,
      },
    });
    const product = await prisma.products.findUnique({
      where: {
        id: data.productId,
      },
    });
    revalidatePath(`/admin/products/${data.productId}`);
    revalidatePath(`/stocker/${data.productId}`);
    revalidatePath("/admin/products");
    revalidatePath("/admin/suggestproducts");
    revalidatePath(`/categories/${product?.categoryId}`);
    revalidatePath("/products");
    revalidatePath("/");
  } catch (error) {
    console.log("editStocksById Error: ", error);
    throw new Error("เกิดข้อผิดพลากจากระบบ");
  }
}

export type UpdatedStocks = {
  detail: string;
  status: true | false;
  productId: string;
};

export async function addStocks(data: UpdatedStocks[]) {
  try {
    const canUse = await requireStocker();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      await prisma.stocks.create({
        data: {
          ...element,
          websiteId: identifyWebsite,
        },
      });
    }

    revalidatePath(`/admin/products/${data[0].productId}`);
    revalidatePath("/admin/products");
    revalidatePath("/admin/suggestproducts");
    revalidatePath(`/categories/${data[0].productId}`);
    revalidatePath("/products");
    revalidatePath("/");
  } catch (error) {
    console.log("addStocks Error: ", error);
    throw new Error("เกิดข้อผิดพลาดจากระบบ");
  }
}

export async function deleteStock(id: string) {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    const stock = await prisma.stocks.delete({
      where: {
        id: id,
        websiteId: identifyWebsite,
      },
    });
    revalidatePath("/admin/products");
    revalidatePath("/admin/suggestproducts");
    revalidatePath(`/admin/products/${stock.productId}`);
    revalidatePath("/products");
    revalidatePath("/");
    return {
      status: true,
      message: "",
    };
  } catch (error) {
    console.log("deleteStock: ", error);
    return {
      status: false,
      message: "เกิดข้อผิดพลาดจากระบบ",
    };
  }
}
