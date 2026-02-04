"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../requireAdmin";
import prisma from "./conn";
import { requireUser } from "../requireUser";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default_site";

export async function getAllDicountCode() {
  const canUse = await requireAdmin();
  if (!canUse) {
    return [];
  }
  try {
    const dCode = await prisma.discountCode.findMany({
      where: {
        websiteId: identifyWebsite,
      },
    });
    return dCode;
  } catch (error) {
    console.log("Error getAllDicountCode: ", error);
    return [];
  }
}

export async function createDiscountCode(data: any) {
  const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่มีสิทธิใช้งาน",
    };
  }
  try {
    const existed = await prisma.discountCode.findFirst({
      where: {
        key: data.key,
        websiteId: identifyWebsite, // กันชนข้ามเว็บ
      },
      select: { id: true },
    });

    if (existed) {
      return {
        success: false,
        message: "มีโค้ดนี้อยู่แล้วในระบบ",
      };
    }

    await prisma.discountCode.create({
      data: {
        name: data.name,
        key: data.key,
        isPercent: data.isPercent,
        reward: data.reward,
        maxUse: data.maxUse,
        canDuplicateUse: data.canDuplicateUse,
        normalProduct: data.normalProduct,
        appPremiumProduct: data.appPremiumProduct,
        orderProduct: data.orderProduct,
        expired: data.expired,
        websiteId: identifyWebsite,
      },
    });

    revalidatePath("/admin/discountcode")

    return {
      success: true,
      message: "สร้างโค้ดส่วนลดสำเร็จ",
    };
  } catch (error) {
    console.log("Error createDiscountCode: ", error);
    return {
      success: false,
      message: "สร้างโค้ดไม่สำเร็จเกิดปัญหาบนเซิฟเวอร์",
    };
  }
}

export async function updateDiscountCode(data: any) {
  const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่มีสิทธิใช้งาน",
    };
  }
  try {
    await prisma.discountCode.update({
      where: {
        id: data.id,
        websiteId: identifyWebsite,
      },
      data: {
        name: data.name,
        key: data.key,
        isPercent: data.isPercent,
        reward: data.reward,
        maxUse: data.maxUse,
        canDuplicateUse: data.canDuplicateUse,
        normalProduct: data.normalProduct,
        appPremiumProduct: data.appPremiumProduct,
        orderProduct: data.orderProduct,
        expired: data.expired,
      },
    });

    revalidatePath("/admin/discountcode")

    return {
      success: true,
      message: "แก้ไขโค้ดส่วนลดสำเร็จ",
    };
  } catch (error) {
    console.log("Error updateDiscountCode: ", error);
    return {
      success: false,
      message: "แก้ไขโค้ดไม่สำเร็จเกิดปัญหาบนเซิฟเวอร์",
    };
  }
}

export async function deleteDiscountcode(dCodeId: string) {
  const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่มีสิทธิใช้งาน",
    };
  }
  try {
    await prisma.discountCode.delete({
      where: {
        id: dCodeId,
        websiteId: identifyWebsite,
      },
    });
    revalidatePath("/admin/discountcode")
    return {
      success: true,
      message: "ลบโค้ดส่วนลดสำเร็จ",
    };
  } catch (error) {
    console.log("Error deleteDiscountcode: ", error);
    return {
      success: false,
      message: "ลบโค้ดไม่สำเร็จเกิดปัญหาบนเซิฟเวอร์",
    };
  }
}

export async function checkDiscountcode(key: string, prodId: string) {
  await requireUser()
  try {
    const haveKey = await prisma.discountCode.findFirst({
      where: {
        key,
        websiteId: identifyWebsite,
      },
    });

    if (!haveKey) {
      return {
        success: false,
        message: "ไม่พบโค้ดในระบบ",
      };
    }

    // หา type ของสินค้า
    const [normal, app, order] = await Promise.all([
      prisma.products.findFirst({
        where: { id: prodId, websiteId: identifyWebsite },
        select: { id: true },
      }),
      prisma.appPremiums.findFirst({
        where: { id: prodId, websiteId: identifyWebsite },
        select: { id: true },
      }),
      prisma.orderProducts.findFirst({
        where: { id: prodId, websiteId: identifyWebsite },
        select: { id: true },
      }),
    ]);

    // ไม่ใช่สินค้าของเว็บนี้เลย
    if (!normal && !app && !order) {
      return {
        success: false,
        message: "ไม่พบสินค้านี้ในระบบ",
      };
    }

    // ตรวจว่าโค้ดรองรับสินค้าประเภทนั้นไหม
    const canUse =
      (normal && haveKey.normalProduct) ||
      (app && haveKey.appPremiumProduct) ||
      (order && haveKey.orderProduct);

    if (!canUse) {
      return {
        success: false,
        message: "โค้ดส่วนลดไม่สามารถใช้กับสินค้านี้ได้",
      };
    }

    return {
      success: true,
      message: `สามารถใช้โค้ดส่วนลดกับสินค้านี้ได้: ${haveKey.isPercent ? `ลด ${haveKey.reward}%`: `ลด ${haveKey.reward}บาท`}`,
      data: haveKey,
    };
  } catch (error) {
    console.log("checkDiscountcode error:", error);
    return {
      success: false,
      message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์",
    };
  }
}

export async function useDiscountCode(key: string, userId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.id !== userId) {
    return { success: false, message: "ไม่สามารถใช้งานได้" };
  }

  const cleanKey = key.trim();
  if (!cleanKey) {
    return { success: false, message: "กรุณากรอกโค้ด" };
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const haveKey = await tx.discountCode.findFirst({
        where: { key: cleanKey, websiteId: identifyWebsite },
        select: {
          id: true,
          key: true,
          websiteId: true,
          canDuplicateUse: true,
          maxUse: true,
          currentUse: true,
          expired: true, // ถ้ามี
        },
      });

      if (!haveKey) {
        return { success: false, message: "ไม่พบโค้ดในระบบ" };
      }

      // ✅ เช็คหมดอายุ (ถ้ามี field)
      if (haveKey.expired && new Date(haveKey.expired) <= new Date()) {
        return { success: false, message: "โค้ดหมดอายุแล้ว" };
      }

      // ✅ ถ้าไม่อนุญาตให้ใช้ซ้ำ → เช็คประวัติ
      if (!haveKey.canDuplicateUse) {
        const used = await tx.historyDiscountCode.findFirst({
          where: {
            userId,
            codeId: haveKey.id,
            websiteId: identifyWebsite,
          },
          select: { id: true },
        });

        if (used) {
          return { success: false, message: "เคยใช้โค้ดนี้ไปแล้ว" };
        }
      }

      // ✅ เช็ค maxUse แบบกัน race
      if (haveKey.maxUse !== null && haveKey.maxUse !== undefined) {
        const updated = await tx.discountCode.updateMany({
          where: {
            id: haveKey.id,
            websiteId: identifyWebsite,
            currentUse: { lt: haveKey.maxUse },
          },
          data: { currentUse: { increment: 1 } },
        });

        if (updated.count === 0) {
          return { success: false, message: "โค้ดถูกใช้งานครบจำนวนแล้ว" };
        }
      } else {
        // ไม่มี maxUse ก็ increment ได้เลย
        await tx.discountCode.update({
          where: { id: haveKey.id },
          data: { currentUse: { increment: 1 } },
        });
      }

      // ✅ บันทึก history (เก็บไว้เสมอ เพื่อ audit)
      await tx.historyDiscountCode.create({
        data: {
          codeId: haveKey.id,
          userId,
          websiteId: identifyWebsite,
        },
      });

      return { success: true, message: "ใช้งานโค้ดสำเร็จ" };
    });
  } catch (error) {
    console.log("useDiscountCode error:", error);
    return { success: false, message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์" };
  }
}
