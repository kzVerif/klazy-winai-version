"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "../requireAdmin";
import prisma from "./conn";
import { requireUser } from "../requireUser";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { checkDiscountcode, useDiscountCode } from "./DiscountCode";
import { sendDiscordWebhook } from "../Discord/discord";
import { requireOrderer } from "../requireOrderer";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

type OrderStatus = "pending" | "success" | "cancel";

export async function updateStatusOrder(
  orderId: string,
  status: OrderStatus,
  reason?: string,
) {
  const canUse = await requireOrderer();
  if (!canUse) {
    return { success: false, message: "ไม่มีสิทธิ์ใช้งาน" };
  }

  // 1) validate status
  const allowed: OrderStatus[] = ["pending", "success", "cancel"];
  if (!allowed.includes(status)) {
    return { success: false, message: "สถานะไม่ถูกต้อง" };
  }

  try {
    // 2) หาออเดอร์ของเว็บนี้ก่อน
    const order = await prisma.historyBuyOrderProducts.findFirst({
      where: { id: orderId, websiteId: identifyWebsite },
      select: { id: true, status: true, reason: true },
    });

    if (!order) {
      return {
        success: false,
        message: "ไม่พบคำสั่งซื้อ หรือไม่ใช่ของเว็บนี้",
      };
    }

    // 3) กติกา: เปลี่ยนได้เฉพาะจาก pending
    if (order.status !== "pending") {
      return {
        success: false,
        message: `คุณได้เปลี่ยนสถานะรายการนี้เป็น ${order.status} แล้ว`,
      };
    }

    // 4) ถ้า cancel ต้องมี reason
    if (status === "cancel") {
      const r = (reason ?? "").trim();
      if (r.length < 3) {
        return {
          success: false,
          message: "กรุณากรอกเหตุผลอย่างน้อย 3 ตัวอักษร",
        };
      }

      const cancel = await prisma.historyBuyOrderProducts.update({
        where: { id: orderId },
        data: { status, reason: r },
      });

      await prisma.users.update({
        where: {
          id: cancel.userId,
          websiteId: cancel.websiteId,
        },
        data: {
          points: {
            increment: cancel.price,
          },
        },
      });
    } else if (status === "success") {
      // success ไม่จำเป็นต้อง reason — จะเก็บเดิมไว้ หรือจะตั้งข้อความก็ได้
      await prisma.historyBuyOrderProducts.update({
        where: { id: orderId },
        data: { status, reason: reason?.trim() || order.reason || "" },
      });
    } else {
      // ถ้าคุณไม่อยากให้ตั้ง pending ผ่าน action ก็ return error ได้
      await prisma.historyBuyOrderProducts.update({
        where: { id: orderId },
        data: { status },
      });
    }

    revalidatePath("/admin/historyorder");
    revalidatePath("/orderer");
    revalidatePath("/history/order");

    return { success: true, message: "แก้ไขสถานะคำสั่งซื้อสำเร็จ" };
  } catch (error) {
    console.log("Error updateStatusOrder:", error);
    return { success: false, message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์" };
  }
}

export async function buyOrderProduct(
  pkg: any,
  userId: string,
  userInfo: any,
  code: string = "",
) {
  await requireUser();
  const session = await getServerSession(authOptions);

  if (userId !== session?.user.id) {
    throw new Error("ทำไรครับเนี่ย");
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId, websiteId: identifyWebsite },
      select: { id: true, points: true, username: true, classId: true },
    });

    if (!user) {
      return { success: false, message: "ไม่พบผู้ใช้ที่ระบุ" };
    }

    const thispkg = await prisma.orderPackages.findUnique({
      where: { id: pkg.id, websiteId: identifyWebsite },
      select: {
        name: true,
        id: true,
        isDiscount: true,
        price: true,
        priceDiscount: true,
        orderProductId: true,
        orderProducts: {
          select: {
            name: true
          }
        }
      },
    });

    if (!thispkg) {
      return { success: false, message: "ไม่พบแพ็คเกจที่ระบุ" };
    }

    // ✅ ราคา base (ก่อนใช้โค้ด)
    const basePrice = thispkg.isDiscount
      ? thispkg.priceDiscount
      : thispkg.price;

    // ✅ ตรวจโค้ด (ถ้ามี)
    const cleanCode = (code ?? "").trim();
    let codeCheck: any = null;

    if (cleanCode !== "") {
      // ✅ ส่ง "รหัสสินค้า" ให้ถูก: orderProductId
      codeCheck = await checkDiscountcode(cleanCode, thispkg.orderProductId);

      if (!codeCheck.success) {
        return {
          success: false,
          message: codeCheck.message,
        };
      }

      // ✅ บันทึกการใช้โค้ด (ทำแค่ครั้งเดียวพอ)
      const used = await useDiscountCode(cleanCode, user.id);
      if (!used.success) {
        return {
          success: false,
          message: used.message,
        };
      }
    }

    // ✅ คำนวณยอดสุทธิ + กันติดลบ
    const computedTotal = codeCheck?.data?.isPercent
      ? basePrice - (basePrice * Number(codeCheck.data.reward)) / 100
      : basePrice - Number(codeCheck?.data?.reward ?? 0);

    const total = Math.max(0, Math.round(computedTotal * 100) / 100);
    const rank = await prisma.class.findFirst({
      where: {
        id: user.classId,
        websiteId: identifyWebsite
      }
    })
    const totalPrice = Math.max(0,rank?.isPercent ? total - (total*rank.reward/100) : total- (rank?.reward ?? 0))
    // ✅ กัน race condition: หักเงินด้วยเงื่อนไข points >= totalPrice
    const updated = await prisma.users.updateMany({
      where: {
        id: user.id,
        websiteId: identifyWebsite,
        points: { gte: totalPrice },
      },
      data: {
        points: { decrement: totalPrice },
      },
    });

    if (updated.count === 0) {
      return { success: false, message: "ยอดเงินในระบบไม่เพียงพอ" };
    }

    await prisma.historyBuyOrderProducts.create({
      data: {
        uid: userInfo.id_user,
        pass: userInfo.password_user,
        contact: userInfo.contact_user,
        userId: session.user.id,
        orderProductId: thispkg.orderProductId,
        orderPackageId: thispkg.id,

        // ✅ เก็บยอดที่จ่ายจริง
        price: totalPrice,

        websiteId: identifyWebsite,
      },
    });

const formatter = new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    });

    await sendDiscordWebhook({
      username: "ระบบร้านค้า (Pre-Order)",
      avatar_url: "https://i.imgur.com/AfFp7pu.png", // (Optional) ใส่ URL รูปโปรไฟล์บอท
      embeds: [
        {
          title: "🧾 มีรายการสั่งซื้อสินค้าพรีออเดอร์ใหม่!",
          description: `ผู้ใช้ **${user.username}** ได้ทำการสั่งซื้อสินค้า`,
          color: 5814783, // สีม่วง
          fields: [
            // แถวที่ 1: ข้อมูลผู้ใช้
            { name: "👤 ผู้ใช้", value: `\`${user.username}\``, inline: true },
            { name: "🆔 User ID", value: `\`${user.id}\``, inline: true },
            { name: "\u200B", value: "\u200B", inline: true }, // เว้นวรรคจัด layout

            // แถวที่ 2: สินค้า
            {
              name: "📦 สินค้า",
              value: thispkg.orderProducts?.name || "ไม่ระบุชื่อสินค้า",
              inline: true,
            },
            {
              name: "🎁 แพ็คเกจ",
              value: thispkg.name || "ไม่ระบุชื่อแพ็คเกจ",
              inline: true,
            },
            { name: "\u200B", value: "\u200B", inline: true },

            // แถวที่ 3: ข้อมูลสำหรับเติมเกม
            {
              name: "🎮 UID/ID เกม",
              value: `\`${userInfo.id_user}\``,
              inline: true,
            },
            {
              name: "📞 ช่องทางติดต่อ",
              value: `\`${userInfo.contact_user}\``,
              inline: true,
            },
             { name: "\u200B", value: "\u200B", inline: true },

            // แถวที่ 4: การเงิน
            {
              name: "🏷️ โค้ดส่วนลด",
              value: cleanCode ? `\`${cleanCode}\`` : "❌ ไม่ได้ใช้",
              inline: true,
            },
            {
              name: "💵 ราคาเต็ม",
              value: formatter.format(basePrice),
              inline: true,
            },
            {
              name: "✅ ยอดชำระจริง",
              value: `**${formatter.format(totalPrice)}**`,
              inline: true,
            },

            // Footer เวลา
            {
              name: "⏳ เวลาทำรายการ",
              value: new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }),
              inline: false,
            },
          ],
          footer: {
            text: `System Alert • Server Time`,
          },
          timestamp: new Date().toISOString(), // ใช้ timestamp ของ Discord เพื่อแสดงเวลา Local ของคนดู
        },
      ],
    });

    revalidatePath("/history/order");
    revalidatePath("/admin/historyorder");
    revalidatePath(`/order/op1/${thispkg.orderProductId}`);

    return {
      success: true,
      message:
        "สั่งซื้อสำเร็จ ตรวจสอบสถานะได้ที่ประวัติการสั่งซื้อสินค้าประเภทพรีออเดอร์",
    };
  } catch (error) {
    console.log("Error buyOrderProduct: ", error);
    return { success: false, message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์" };
  }
}

export async function getOrderSettingForAdmin() {
  const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ",
    };
  }
  try {
    const data = await prisma.orderSetting.findUnique({
      where: { websiteId: identifyWebsite },
    });
    return data;
  } catch (error) {
    console.log("error getOrderSettingForAdmin : ", error);
  }
}

export async function getOrderSettingForUser() {
  try {
    const data = await prisma.orderSetting.findUnique({
      where: { websiteId: identifyWebsite },
      select: {
        id: true,
        image: true,
        status: true,
        isSuggest: true,
      },
    });
    return data;
  } catch (error) {
    console.log("error getOrderSettingForAdmin : ", error);
  }
}

export async function updatetOrderSetting(updatedData: any) {
  const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ",
    };
  }
  try {
    await prisma.orderSetting.update({
      where: {
        id: updatedData.id,
        websiteId: identifyWebsite,
      },
      data: {
        status: updatedData.status,
        isSuggest: updatedData.isSuggest,
        image: updatedData.image,
      },
    });
  } catch (error) {
    console.log("error updatetOrderSetting : ", error);
  }
}

export async function createOrderProduct(data: any) {
  const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ",
    };
  }
  try {
    await prisma.orderProducts.create({
      data: {
        name: data.name,
        detail: data.detail,
        image: data.image,
        websiteId: identifyWebsite,
      },
    });
    revalidatePath("/admin/orders");
  } catch (error) {
    console.log("error createOrderProduct : ", error);
  }
}

export async function getAllOrderProducts() {
  try {
    const products = await prisma.orderProducts.findMany({
      where: { websiteId: identifyWebsite },
    });
    if (!products) {
      return [];
    }
    return products;
  } catch (error) {
    console.log("error getAllOrderProducts : ", error);
    return [];
  }
}

export async function updateOrderProduct(data: any) {
  const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ",
    };
  }

  try {
    await prisma.orderProducts.update({
      where: {
        id: data.id,
        websiteId: identifyWebsite,
      },
      data: {
        name: data.name,
        detail: data.detail,
        image: data.image,
      },
    });
    revalidatePath("/admin/orders");
  } catch (error) {
    console.log("error updateOrderProduct : ", error);
  }
}

export async function deleteOrderProduct(id: string) {
  const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ",
    };
  }
  try {
    await prisma.orderProducts.delete({
      where: {
        id: id,
        websiteId: identifyWebsite,
      },
    });
    revalidatePath("/admin/orders");
  } catch (error) {
    console.log("error deleteOrderProduct : ", error);
  }
}

export async function getOrderProductById(id: string) {
  try {
    const product = await prisma.orderProducts.findUnique({
      where: {
        id: id,
        websiteId: identifyWebsite,
      },
    });
    if (!product) {
      return null;
    }
    return product;
  } catch (error) {
    console.log("error getOrderProductById : ", error);
    return null;
  }
}
