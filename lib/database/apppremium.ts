"use server";
import { revalidatePath } from "next/cache";
import prisma from "./conn";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth";
import { requireUser } from "../requireUser";
import { requireAdmin } from "../requireAdmin";
import { checkDiscountcode, useDiscountCode } from "./DiscountCode";
import { sendDiscordWebhook } from "../Discord/discord";

const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default_site";

export async function getStatusAppremiumForUser() {
  const data = await prisma.appPremiumSetting.findUnique({
    where: { websiteId: identifyWebsite },
    select: {
      status: true,
      image: true,
      isSuggest: true,
    },
  });
  if (!data) {
    return {
      id: null,
      status: false,
      image: null,
      isSuggest: false,
    };
  }
  return data;
}

export async function getStatusAppremium() {
  const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ",
    };
  }
  const data = await prisma.appPremiumSetting.findFirst({
    where: { websiteId: identifyWebsite },
  });
  if (!data) {
    return {
      id: null,
      status: false,
      key: null,
      image: null,
      isSuggest: false,
    };
  }
  return data;
}

export async function updateStatusAppremium(updateData: {
  id: string | null;
  status: boolean;
  image?: string;
  key?: string;
  isSuggest: boolean;
}) {
  // 1) validate input ให้ครบทุกทาง
  if (!updateData.id) {
    return { success: false, message: "ไม่พบ ID รายการ" };
  }

  // 2) auth ให้เป็น business error ชัด ๆ
  const canUse = await requireAdmin().catch(() => false);
  if (!canUse) {
    return { success: false, message: "ไม่มีสิทธิ์ทำรายการนี้" };
  }

  try {
    await prisma.appPremiumSetting.update({
      where: { id: updateData.id, websiteId: identifyWebsite },
      data: {
        status: updateData.status,
        image: updateData.image,
        key: updateData.key,
      },
    });

    revalidatePath("/admin/apppremium");
    revalidatePath("/app_premium");

    return { success: true, message: "อัปเดทการตั้งค่าแอปพรีเมี่ยมสำเร็จ" };
  } catch (error: any) {
    if (error?.code === "P2025") {
      return { success: false, message: "ไม่พบรายการที่ต้องการอัปเดท" };
    }

    console.error("Error updating app premium status:", error);
    return { success: false, message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์" };
  }
}

export async function getAllAppPremiumProducts() {
  const products = await prisma.appPremiums.findMany({
    where: { websiteId: identifyWebsite },
  });
  const plainProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
    priceDiscount: Number(product.priceDiscount),
  }));
  return plainProducts;
}

export async function getAppPremiumById(id: string) {
  const product = await prisma.appPremiums.findUnique({
    where: { id, websiteId: identifyWebsite },
  });
  if (product) {
    return {
      ...product,
      price: Number(product.price),
      priceDiscount: Number(product.priceDiscount),
    };
  }
  return null;
}

export async function updateAppPremiumProduct(updateData: {
  id: string;
  name: string;
  price: number;
  priceDiscount: number;
  isDiscount?: boolean;
}) {
  const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ",
    };
  }
  try {
    await prisma.appPremiums.update({
      where: { id: updateData.id, websiteId: identifyWebsite },
      data: {
        name: updateData.name,
        price: Number(updateData.price),
        priceDiscount: Number(updateData.priceDiscount),
        isDiscount: updateData.isDiscount ?? false,
      },
    });
    revalidatePath("/admin/apppremium");
    revalidatePath("/app_premium");
     return {
      success: true,
      message: "แก้ไขแอปพรีเมี่ยมสำเร็จ",
    };
  } catch (error) {
    console.error("Error updating app premium product:", error);
    return {
      success: false,
      message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์",
    };
  }
}

export async function BuyAppPremium(data: any) {
  const canuse = await requireUser();
  if (!canuse) {
    return { success: false, message: "ไม่สามารถใช้งานได้" }
  }

  const appSetting = await getStatusAppremium();
  if (!appSetting.status) {
    return { success: false, message: "ระบบแอปพรีเมียมปิดใช้งานอยู่" };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.id !== data.userId) {
    return { success: false, message: "ทำไรครับเนี่ย" };
  }

  try {
    // 🟡 1) หา user + สินค้าในระบบเรา (เพิ่ม username และ name เพื่อเอาไปโชว์ใน Webhook)
    const [user, appPremiums] = await Promise.all([
      prisma.users.findFirst({
        where: { id: data.userId, websiteId: identifyWebsite },
        select: { id: true, points: true, username: true, classId: true}, // ✅ เพิ่ม username
      }),
      prisma.appPremiums.findFirst({
        where: { id: data.productId, websiteId: identifyWebsite },
        select: {
          id: true,
          name: true, // ✅ เพิ่ม name (ชื่อสินค้า)
          price: true,
          priceDiscount: true,
          isDiscount: true,
        },
      }),
    ]);

    if (!user) return { success: false, message: "ไม่พบผู้ใช้" };
    if (!appPremiums)
      return { success: false, message: "ไม่พบสินค้าในระบบ" };

    // 2) ยิง API ดู stock
    const res = await fetch(
      `https://byshop.me/api/product?id=${data.byshopId}`
    );

    const product = await res.json();
    const stock = Number(product[0].stock ?? 0);

    if (!product || stock <= 0) {
      return { success: false, message: "ไม่พบสินค้าหรือสินค้าหมด" };
    }

    // 3) คำนวณราคา base
    const basePrice = appPremiums.isDiscount
      ? Number(appPremiums.priceDiscount)
      : Number(appPremiums.price);
    const baseTotal = basePrice;

    // 4) ตรวจโค้ดส่วนลด
    const cleanCode = String(data.code ?? "").trim();
    let codeCheck: any = null;

    if (cleanCode) {
      codeCheck = await checkDiscountcode(cleanCode, appPremiums.id);
      if (!codeCheck.success)
        return { success: false, message: codeCheck.message };

      const canUse = await useDiscountCode(cleanCode, user.id);
      if (!canUse.success) return { success: false, message: canUse.message };
    }

    const reward = Number(codeCheck?.data?.reward ?? 0);
    const computedTotal = codeCheck?.data?.isPercent
      ? baseTotal - (baseTotal * reward) / 100
      : baseTotal - reward;

    const total = Math.max(0, Math.round(computedTotal * 100) / 100);

    const rank = await prisma.class.findFirst({
      where: {
        id: user.classId,
        websiteId: identifyWebsite
      }
    })
    const priceTotal = Math.max(0,rank?.isPercent ? total - (total*rank.reward/100) : total- (rank?.reward ?? 0))
    // 5) หักแต้ม
    const dec = await prisma.users.update({
      where: {
        id: user.id,
        websiteId: identifyWebsite,
        points: { gte: priceTotal },
      },
      data: { points: { decrement: priceTotal } },
    });

    if (dec.points < priceTotal) {
      return { success: false, message: "ยอดเงินในระบบไม่เพียงพอ" };
    }

    // 6) เรียก buy จาก API ภายนอก
    const formData = new FormData();
    formData.append("id", data.byshopId);
    formData.append("keyapi", appSetting.key ?? "");
    formData.append("username_customer", user.id);

    const resBuy = await fetch("https://byshop.me/api/buy", {
      method: "POST",
      body: formData,
    });
    const buyResult = await resBuy.json();

    if (buyResult.status !== "success") {
      // ✅ คืนแต้ม ถ้าซื้อไม่สำเร็จ
      await prisma.users.update({
        where: { id: user.id, websiteId: identifyWebsite },
        data: { points: { increment: priceTotal } },
      });

      return {
        success: false,
        message: buyResult.message || "ซื้อสินค้าล้มเหลว",
      };
    }

    // 7) บันทึกประวัติ
    await prisma.historyBuyAppPremium.create({
      data: {
        userId: user.id,
        appPremiumId: String(appPremiums.id),
        info: buyResult.info,
        price: priceTotal,
        websiteId: identifyWebsite,
      },
    });

    // 🟡 8) ส่วน Webhook Discord
    const formatter = new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    });

    await sendDiscordWebhook({
      username: "ระบบแอพพรีเมียม",
      avatar_url: "https://i.imgur.com/AfFp7pu.png", // ใส่รูปโปรไฟล์บอทตามต้องการ
      embeds: [
        {
          title: "🛒 มีรายการสั่งซื้อแอพพรีเมียมสำเร็จ!",
          description: `ผู้ใช้ **${user.username}** ทำรายการสั่งซื้อเรียบร้อย`,
          color: 3066993, // สีเขียว
          fields: [
            // แถว 1: ข้อมูล User
            { name: "👤 ผู้ใช้", value: `\`${user.username}\``, inline: true },
            { name: "📦 สินค้า", value: appPremiums.name, inline: true },
            { name: "\u200B", value: "\u200B", inline: true },

            // แถว 2: ราคา
            {
              name: "🔖 โค้ดส่วนลด",
              value: cleanCode ? `\`${cleanCode}\`` : "❌ ไม่ได้ใช้",
              inline: true,
            },
            {
              name: "💰 ราคาปกติ",
              value: formatter.format(basePrice),
              inline: true,
            },
            {
              name: "✅ ยอดชำระจริง",
              value: `**${formatter.format(priceTotal)}**`,
              inline: true,
            },
            
            // Footer
            {
              name: "⏳ เวลาทำรายการ",
              value: new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }),
              inline: false,
            },
          ],
          footer: { text: "App Premium System Alert" },
          timestamp: new Date().toISOString(),
        },
      ],
    });

    revalidatePath("/history/premium");
    revalidatePath("/app_premium");

    return { success: true, message: "ซื้อสินค้าสำเร็จ" };
  } catch (error) {
    console.error("Error creating app premium order:", error);
    return {
      success: false,
      message: "ซื้อสินค้าไม่สำเร็จ ข้อผิดพลาดภายในระบบ",
    };
  }
}

