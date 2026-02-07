"use server";
import prisma from "./conn";
import { revalidatePath } from "next/cache";
import { requireUser } from "../requireUser";
import { requireAdmin } from "../requireAdmin";

const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function getShopSettings() {
  try {
    const setting = await prisma.settings.findFirst({
      where: {
        websiteId: identifyWebsite,
      },
    });
    return setting;
  } catch (error) {
    console.log("getShopSettings Error: ", error);
    return {
      id: "",
      primaryColor: "",
      secondaryColor: "",
      hoverColor: "",
      backgroundImage: "",
      webhookDiscord: "",
      shopName: "",
      announcement: "",
      icon: "",
      logo: "",
      detail: "",
      contact: "",
      createdAt: null,
      updatedAt: null,
      banner: "",
    };
  }
}

export async function updateShopSetting(data: any) {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    await prisma.settings.update({
      where: {
        id: data.id,
        websiteId: identifyWebsite,
      },
      data: {
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        hoverColor: data.hoverColor,
        backgroundImage: data.backgroundImage,
        webhookDiscord: data.webhookDiscord,
        shopName: data.shopName,
        announcement: data.announcement,
        icon: data.icon,
        logo: data.logo,
        detail: data.detail,
        contact: data.contact,
        banner: data.banner,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/commonsetting");
    return {
      success: true,
      message: "แก้ไขการตั้งค่าทัั่วไปสำเร็จ",
    };
  } catch (error) {
    console.log("updateShopSetting Error: ", error);
    return {
      success: false,
      message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์",
    };
  }
}

export async function getColorSetting() {
  try {
    const setting = await prisma.settings.findUnique({
      where: {
        websiteId: identifyWebsite,
      },
      select: {
        primaryColor: true,
        secondaryColor: true,
        hoverColor: true,
      },
    });
    return {
      primaryColor: setting?.primaryColor,
      secondaryColor: setting?.secondaryColor,
      hoverColor: setting?.hoverColor,
    };
  } catch (error) {
    console.log("getColorSetting Error: ", error);
    return {};
  }
}
