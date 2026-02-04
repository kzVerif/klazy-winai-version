"use server";
import prisma from "./conn";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function getHomepage() {
  try {
    const setting = await prisma.settings.findFirst({
      where: {
       websiteId: identifyWebsite
      },
      select: {
        banner: true,
        announcement: true,
      },
    });
    const member = await prisma.users.count();
    const allStock = await prisma.stocks.count();
    const soldStock = await prisma.stocks.count({
      where: {
        websiteId: identifyWebsite,
        status: false,
      },
    });
    const suggestCategories = await prisma.suggestCategories.findMany({
      where: {
        websiteId: identifyWebsite
      },
      include: {
        category: {
          include: {
            Products: true,
          },
        },
      },
    });
    const suggestProducts = await prisma.suggestProducts.findMany({
      include: {
        product: {
          include: {
            stocks: {
              where: {
                status: true,
                websiteId: identifyWebsite
              }
            },
          },
        },
      },
    });
            
    return {
      setting,
      member,
      allStock,
      soldStock,
      categories: suggestCategories,
      shop: suggestProducts,
    };
  } catch (error) {
    console.log("getHomepage Error: ", error);
    return {
      setting: {
        banner: "",
        announcement: "",
      },
      member: 0,
      allStock: 0,
      soldStock: 0,
      categories: [],
      shop: [],
    };
  }
}
