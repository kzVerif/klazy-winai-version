"use server";

import prisma from "./conn";

const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

export async function expiredCheck() {
  try {
    const web = await prisma.websites.findUnique({
      where: {
        id: identifyWebsite,
      },
    });
    if (!web || !web?.expiresAt) {
      return false;
    }
    if (new Date() < web?.expiresAt) {
      return true;
    }
  } catch (error) {
    console.log("Error expiredCheck: ", error);
    return false;
  }
}
