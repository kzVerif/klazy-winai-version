"use server";
import { revalidatePath } from "next/cache";
import prisma from "./conn";
import { sendDiscordWebhook } from "../Discord/discord";
import { requireUser } from "../requireUser";
import { requireAdmin } from "../requireAdmin";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { checkDiscountcode, useDiscountCode } from "./DiscountCode";

const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export interface productData {
  name: string;
  image: string;
  detail: string;
  price: number;
  categoriesId: string;
  priceDiscount: number;
  isDiscount: boolean;
}

export interface updateProduct {
  id: string;
  name: string;
  image: string;
  detail: string;
  price: number;
  categoriesId: string;
  priceDiscount: number;
  isDiscount: boolean;
}

export async function getProductByCategory(id: string) {
  try {
    const products = await prisma.products.findMany({
      where: {
        categoryId: id,
        websiteId: identifyWebsite,
      },
      include: {
        stocks: {
          where: {
            status: true,
            websiteId: identifyWebsite,
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
    const plainProducts = products.map((item) => ({
      ...item,
      price: Number(item.price),
    }));
    return plainProducts;
  } catch (error) {
    console.log("getProductByCategory Error: ", error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.products.findUnique({
      where: { id, websiteId: identifyWebsite },
      include: {
        stocks: {
          where: { status: true, websiteId: identifyWebsite },
        },
      },
    });

    if (!product) return null;

    return {
      ...product,
      priceDiscount: Number(product.priceDiscount),
      price: Number(product.price),
    };
  } catch (error) {
    console.log("getProductById Error:", error);
    return null;
  }
}

export async function getAllProducts() {
  try {
    const products = await prisma.products.findMany({
      where: {websiteId: identifyWebsite},
      include: {
        category: true,
        _count: {
          select: {
            stocks: {
              where: {
                status: true,
                websiteId: identifyWebsite,
              },
            },
          },
        },
      },
    });

    const categories = await prisma.categories.findMany({where: {
      websiteId: identifyWebsite
    }});

    const plainProducts = products.map((item) => ({
      ...item,
      price: Number(item.price),
      remain: item._count.stocks,
      priceDiscount: Number(item.priceDiscount),
      allCategories: categories, // จำนวนสต็อกคงเหลือของสินค้านั้น
    }));

    return plainProducts;
  } catch (error) {
    console.log("getAllProducts Error: ", error);
    return [];
  }
}

export async function updateProduct(data: updateProduct) {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    await prisma.products.update({
      where: { id: data.id, websiteId: identifyWebsite },
      data: {
        name: data.name,
        image: data.image,
        detail: data.detail,
        price: data.price,
        isDiscount: data.isDiscount,
        categoryId: data.categoriesId,
        priceDiscount: data.priceDiscount,
      },
    });
    revalidatePath("/admin/products");
    revalidatePath("/admin/suggestproducts");
    revalidatePath(`/categories/${data.categoriesId}`);
    revalidatePath("/products");
    revalidatePath("/");
  } catch (error) {
    console.log("updateProduct Error: ", error);
    throw new Error("เกิดข้อผืดพลาดจากระบบ");
  }
}

export async function createProducts(data: productData) {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    await prisma.products.create({
      data: {
        name: data.name,
        image: data.image,
        detail: data.detail,
        price: data.price,
        isDiscount: data.isDiscount,
        categoryId: data.categoriesId,
        priceDiscount: data.priceDiscount,
        websiteId: identifyWebsite,
      },
    });
    revalidatePath("/admin/products");
    revalidatePath("/admin/suggestproducts");
    revalidatePath(`/categories/${data.categoriesId}`);
    revalidatePath("/products");
    revalidatePath("/");
  } catch (error) {
    console.log("createProducts Error: ", error);
    throw new Error("เกิดข้อผิดพลากจากระบบ");
  }
}

export async function deleteProduct(id: string) {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    const product = await prisma.products.delete({
      where: { id: id, websiteId: identifyWebsite },
    });
    revalidatePath("/admin/products");
    revalidatePath("/admin/suggestproducts");
    revalidatePath(`/categories/${product.categoryId}`);
    revalidatePath("/products");
    revalidatePath("/");
  } catch (error) {
    console.log("deleteProduct Error: ", error);
    throw new Error("เกิดข้อผิดพลาดจากระบบ");
  }
}

export async function buyProducts(
  quantity: number,
  userId: string,
  productId: string,
  code: string = "",
) {
  try {
    await requireUser();

    // ✅ ป้องกัน userId ปลอม (เหมือนที่ทำในฟังก์ชันอื่น ๆ)
    const session = await getServerSession(authOptions);
    if (session?.user.id !== userId) {
      return {
        status: false,
        message: "ทำไรครับเนี่ย",
      };
    }

    const [user, product] = await Promise.all([
      prisma.users.findUnique({
        where: { id: userId, websiteId: identifyWebsite },
      }),
      prisma.products.findUnique({
        where: { id: productId, websiteId: identifyWebsite },
      }),
    ]);

    if (!user || !product) {
      return {
        status: false,
        message: "ไม่พบผู้ใช้หรือสินค้าที่ระบุ",
      };
    }

    // ✅ ราคาต่อชิ้น (ก่อนโค้ดส่วนลด)
    const unitPrice = product.isDiscount
      ? Number(product.priceDiscount)
      : Number(product.price);

    // ✅ ราคารวมก่อนโค้ดส่วนลด
    const baseTotalPrice = unitPrice * quantity;

    // ✅ ตรวจโค้ดส่วนลด (ถ้ามี)
    let codeCheck: any = null;

    if (code && code.trim() !== "") {
      codeCheck = await checkDiscountcode(code.trim(), product.id);

      if (!codeCheck.success) {
        return {
          status: false,
          message: codeCheck.message,
        };
      }

      // ✅ บันทึกการใช้โค้ด (ถ้าระบบกำหนดว่า "ห้ามใช้ซ้ำ" ก็จะกันได้ที่นี่)
      const used = await useDiscountCode(code.trim(), user.id);

      if (!used.success) {
        return {
          status: false,
          message: used.message,
        };
      }
    }

    // ✅ คำนวณส่วนลด
    const discountData = codeCheck?.data;

    const total = discountData?.isPercent
      ? Math.max(
          0,
          baseTotalPrice - baseTotalPrice * (Number(discountData.reward) / 100),
        )
      : Math.max(0, baseTotalPrice - Number(discountData?.reward ?? 0));
    const rank  = await prisma.class.findFirst({
      where: {
        id: user.classId,
        websiteId: identifyWebsite
      }
    })
    
    const totalPrice = Math.max(0,rank?.isPercent ? total - (total*rank.reward/100) : total- (rank?.reward ?? 0)
)
    if (totalPrice > Number(user.points)) {
      return {
        status: false,
        message: "ยอดเงินของคุณไม่เพียงพอ กรุณาเติมเงิน",
      };
    }

    // 1️⃣ ดึง stocks ที่ว่าง
    const stocks = await prisma.stocks.findMany({
      where: {
        productId: productId,
        status: true,
        websiteId: identifyWebsite,
      },
      take: quantity,
    });

    if (stocks.length < quantity) {
      return {
        status: false,
        message: "จำนวนสินค้าที่ต้องการซื้อมีไม่เพียงพอ",
      };
    }

    // ✅ ทำธุรกรรมให้ครบชุด (กันตัดเงินแล้ว stock ไม่อัปเดต หรือกลับกัน)
    await prisma.$transaction(async (tx) => {
      // 2️⃣ อัปเดต stocks เป็น SOLD
      await tx.stocks.updateMany({
        where: { id: { in: stocks.map((s) => s.id) } },
        data: { status: false },
      });

      // ✅ คำนวณราคาต่อชิ้นหลังลด (ให้รวมแล้วเท่ากับ totalPrice)
      const perItemPaid =
        quantity > 0 ? Math.round((totalPrice / quantity) * 100) / 100 : 0;

      // 3️⃣ สร้าง historyBuy (บันทึกราคาต่อชิ้นหลังลด)
      await tx.historyBuy.createMany({
        data: stocks.map((s) => ({
          userId,
          stockId: s.id,
          productId,
          price: perItemPaid, // ✅ เปลี่ยนจาก unitPrice -> perItemPaid
          websiteId: identifyWebsite,
        })),
      });

      // 4️⃣ ลด points ของ user (ใช้ decrement จะชัวร์กว่า)
      await tx.users.update({
        where: { id: userId, websiteId: identifyWebsite },
        data: {
          points: { decrement: totalPrice },
        },
      });
    });

    // ✅ webhook: แสดงทั้งยอดเดิมและยอดหลังโค้ด (ถ้ามี)
    await sendDiscordWebhook({
      username: "ระบบร้านค้า",
      embeds: [
        {
          title: "🛒 มีรายการสั่งซื้อสินค้า!",
          description: "มีผู้ใช้ทำการซื้อสินค้าในระบบ",
          color: 16312092,
          fields: [
            { name: "👤 ผู้ใช้", value: `${user.username}`, inline: true },
            { name: "🛍️ สินค้า", value: `${product.name}`, inline: true },
            { name: "🔢 จำนวน", value: `${quantity}`, inline: true },

            // ✅ ถ้ามีโค้ดส่วนลด แสดงรายละเอียดเพิ่ม
            ...(discountData
              ? [
                  {
                    name: "🏷️ โค้ดส่วนลด",
                    value: `${discountData.key} (${
                      discountData.isPercent
                        ? `-${discountData.reward}%`
                        : `-${discountData.reward}฿`
                    })`,
                    inline: true,
                  },
                  {
                    name: "💵 ยอดก่อนส่วนลด",
                    value: `${baseTotalPrice.toFixed(2)} ฿`,
                    inline: true,
                  },
                ]
              : []),

            { name: "✅ ยอดชำระ", value: `${totalPrice.toFixed(2)} ฿` },
            { name: "⏳ เวลาทำรายการ", value: `${new Date()}` },
          ],
          footer: {
            text: "🛒 ระบบแจ้งเตือนการซื้อสินค้า",
          },
        },
      ],
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin/suggestproducts");
    revalidatePath(`/categories/${product.categoryId}`);
    revalidatePath("/products");
    revalidatePath("/");

    return {
      status: true,
      message: "ซื้อสินค้าสำเร็จ",
    };
  } catch (error: any) {
    console.log("buyProducts Error:", error.message || error);
    return {
      status: false,
      message: "เกิดข้อผิดพลากจากระบบ",
    };
  }
}
