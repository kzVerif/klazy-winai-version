"use server";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default_site";
import { requireAdmin } from "../requireAdmin";
import { requireUser } from "../requireUser";
import prisma from "./conn";
import { revalidatePath } from "next/cache";

export async function getAllClassRank() {
  try {
      const canuse = await requireUser();
  if (!canuse) {
    return []
  }
    const rank = await prisma.class.findMany({
      where: {
        websiteId: identifyWebsite,
      },
      orderBy: {
        upgrade: "asc",
      },
    });

    return rank;
  } catch (error) {
    console.log("Error getAllClassRank: ", error);
    return [];
  }
}

export async function addClassRank(data: any) {
  try {
    const canuser = await requireAdmin();
    if (!canuser) {
      return {
        success: false,
        message: "ไม่สามารถใช้งานได้",
      };
    }
    await prisma.class.create({
      data: {
        className: data.className,
        upgrade: data.upgrade,
        isPercent: data.isPercent,
        reward: data.reward,
        websiteId: identifyWebsite,
      },
    });
    revalidatePath("/admin/classrank");
    revalidatePath("/profile");
    return {
      success: true,
      message: "สร้างคลาสสำเร็จ",
    };
  } catch (error) {
    console.log("Error : ", error);
    return {
      success: true,
      message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์",
    };
  }
}

export async function deleteClassRank(id: string) {
  try {
    const canuser = await requireAdmin();
    if (!canuser) return { success: false, message: "สิทธิ์ไม่เพียงพอ" };

    const defaultRankId = `rank-${identifyWebsite}`;

    // 1. ป้องกันการลบคลาสเริ่มต้นของระบบ
    if (id === defaultRankId) {
      return { success: false, message: "ไม่สามารถลบคลาสเริ่มต้นของระบบได้" };
    }

    // 2. ตรวจสอบว่าคลาสที่จะลบมีอยู่จริงและเป็นของ Website นี้
    const rank = await prisma.class.findFirst({
      where: { id, websiteId: identifyWebsite },
    });

    if (!rank) {
      return { success: false, message: "ไม่พบข้อมูลคลาส" };
    }

    // 3. ใช้ Transaction เพื่อให้มั่นใจว่าถ้าขั้นตอนไหนพัง ข้อมูลจะไม่เละ
    return await prisma.$transaction(async (tx) => {
      // ย้าย Users ทุกคนในคลาสที่จะลบ ไปยังคลาสเริ่มต้น
      await tx.users.updateMany({
        where: {
          classId: id,
          websiteId: identifyWebsite,
        },
        data: {
          classId: defaultRankId,
        },
      });

      // ลบคลาส
      await tx.class.delete({
        where: { id: id },
      });
      revalidatePath("/admin/classrank");
      revalidatePath("/profile");
      return { success: true, message: "ลบข้อมูลและย้ายสมาชิกเรียบร้อยแล้ว" };
    });
  } catch (error) {
    console.error("Delete Class Error:", error);
    return { success: false, message: "เกิดข้อผิดพลาดภายในระบบ" };
  }
}

export async function updateClassRank(data: any) {
  try {
    const canuser = await requireAdmin();
    if (!canuser) {
      return {
        success: false,
        message: "ไม่สามารถใช้งานได้",
      };
    }
    await prisma.class.update({
      where: {
        id: data.id,
        websiteId: identifyWebsite,
      },
      data: {
        className: data.className,
        upgrade: data.upgrade,
        isPercent: data.isPercent,
        reward: data.reward,
        websiteId: identifyWebsite,
      },
    });
    revalidatePath("/admin/classrank");
    revalidatePath("/profile");
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "แก้ไขคลาสสำเร็จ",
    };
  } catch (error) {
    console.log("Error : ", error);
    return {
      success: true,
      message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์",
    };
  }
}

export async function upgradeClass(userId: string) {
  try {
      const canuse = await requireUser();
  if (!canuse) {
    return { success: false, message: "ไม่สามารถใช้งานได้" }
  }

    // 1. ดึงข้อมูล User และ Rank ทั้งหมดมาเตรียมไว้
    // เรียง upgrade จากมากไปน้อย (desc) เพื่อเช็ค rank สูงสุดก่อน
    const [user, allRanks] = await Promise.all([
      prisma.users.findUnique({
        where: { id: userId, websiteId: identifyWebsite },
      }),
      prisma.class.findMany({
        where: { websiteId: identifyWebsite },
        orderBy: { upgrade: "desc" }, // สำคัญมาก: เช็ค Rank สูงสุดก่อน
      }),
    ]);

    if (!user) return { success: false, message: "ไม่พบผู้ใช้ในระบบ" };
    if (allRanks.length === 0)
      return { success: false, message: "ยังไม่มีระบบคลาสในขณะนี้" };

    // 2. ค้นหา Rank ที่เหมาะสมที่สุดตามแต้มที่มี (Total Points)
    const targetRank = allRanks.find(
      (rank) => user.totalPoints >= rank.upgrade,
    );

    if (!targetRank) {
      return {
        success: false,
        message: "แต้มของคุณยังไม่เพียงพอสำหรับการอัปเกรด",
      };
    }

    // 3. ตรวจสอบว่า Rank ที่หาได้ สูงกว่า Rank ปัจจุบันหรือไม่ (ป้องกันการ downgrade)
    // หรือเช็คว่าถ้าเป็น Rank เดิมอยู่แล้วก็ไม่ต้องกดอัปเกรด
    if (user.classId === targetRank.id) {
      return { success: false, message: "คุณอยู่ในคลาสที่เหมาะสมอยู่แล้ว" };
    }

    // 4. ทำการอัปเกรด
    await prisma.users.update({
      where: { id: userId },
      data: {
        classId: targetRank.id,
        userClassName: targetRank.className, // เก็บชื่อไว้แสดงผล (De-normalization)
      },
    });
    revalidatePath("/profile");
    revalidatePath("/admin/users");
    return {
      success: true,
      message: `คุณได้รับการอัปเกรดเป็นคลาส ${targetRank.className}`,
    };
  } catch (error) {
    console.error("Error upgradeClass: ", error);
    return { success: false, message: "เกิดข้อผิดพลาดทางเซิร์ฟเวอร์" };
  }
}
