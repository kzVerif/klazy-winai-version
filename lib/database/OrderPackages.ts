"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "../requireAdmin";
import prisma from "./conn";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function createOrderPackage(data: any) {
          const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ"
    }
  }
  try {
    await prisma.orderPackages.create({
      data: {
        name: data.name,
        price: data.price,
        isDiscount: data.isDiscount,
        priceDiscount: data.priceDiscount,
        orderProductId: data.orderProductId,
        websiteId: identifyWebsite
      },
    });
    revalidatePath(`/admin/orders/${data.orderProductId}`);
    return {
      success: true,
      message: "แก้ไขแพ็คเกจสำเร็จ"
    }
  } catch (error) {
    console.log("error createOrderPackage : ", error);
    return {
      success: false,
      message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์"
    }
  }
}

export async function getOrderPackageByOrderId(id: string) {
  try {
    const packages = await prisma.orderPackages.findMany({
      where: {
        orderProductId: id,
        websiteId: identifyWebsite
      },
    });

    if (!packages) {
      return null;
    }

    const plainPackages = packages.map((pkg) => ({
      ...pkg,
      price: Number(pkg.price),
      priceDiscount: Number(pkg.priceDiscount),
    }));

    return plainPackages;
  } catch (error) {
    console.log("Error geyPackageByOrderId", error);
    return null;
  }
}

export async function updateOrderPackageById(data: any) {
          const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ"
    }
  }
  try {
    await prisma.orderPackages.update({
      where: {
        id: data.id,
        websiteId: identifyWebsite
      },
      data: {
        name: data.name,
        price: data.price,
        isDiscount: data.isDiscount,
        priceDiscount: data.priceDiscount,
      },
    });
    revalidatePath(`/admin/orders/${data.id}`);
    return {
      success: true,
      message: "บบแพ็คเกจสำเร็จ"
    }
  } catch (error) {
    console.log("updateOrderPackageById Error: ", error);
    return {
      success: false,
      message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์"
    }
  }
}

export async function deleteOrderPackageById(id: string) {
          const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ"
    }
  }
  try {
    const pkg = await prisma.orderPackages.delete({
      where: {
        id,
        websiteId: identifyWebsite
      },
    });
    revalidatePath(`/admin/orders/${pkg.orderProductId}`);
    return {
      success: true,
      message: "ลบแพ็คเกจสำเร็จ"
    }
  } catch (error) {
    console.log("Error deleteOrderPackageById: ", error);
    return {
      success: false,
      message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์"
    }
  }
}
