"use server";
import { revalidatePath } from "next/cache";
import prisma from "./conn";
import bcrypt from "bcrypt";
import { walletTopup } from "../Topup/wallet";
import { TopupBank } from "../Topup/bank";
import { sendDiscordWebhook } from "../Discord/discord";
import { requireUser } from "../requireUser";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { requireAdmin } from "../requireAdmin";
import { upgradeClass } from "./Class";

const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default";

interface authData {
  username: string;
  password: string;
}

export async function createUser(userData: authData) {
  try {
    const haveUser = await prisma.users.findFirst({
      where: { username: userData.username, websiteId: identifyWebsite },
    });

    if (haveUser) {
      return { success: false, message: "มีผู้ใช้นี้แล้วในระบบ" };
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);

    const rank = await prisma.class.findFirst({
      where: {
        websiteId: identifyWebsite,
        id: `rank-${identifyWebsite}`,
      },
    });

    if (!rank) {
      return { success: false, message: "ไม่พบแรงก์ที่กำหนด" };
    }

    const user = await prisma.users.create({
      data: {
        username: userData.username,
        password: hashPassword,
        points: 0, // ใส่ 0 ให้ Decimal
        totalPoints: 0, // ใส่ 0 ให้ Decimal
        websiteId: identifyWebsite,
        classId: rank?.id,
        userClassName: rank?.className,
      },
    });

    await sendDiscordWebhook({
      username: "ระบบแจ้งเตือน",
      embeds: [
        {
          title: "👤 สมาชิกใหม่!",
          description: "มีผู้ใช้ใหม่สมัครสมาชิกบนระบบของคุณ",
          color: 3900991,
          fields: [
            { name: "📛 ชื่อผู้ใช้", value: `${user.username}`, inline: true },
            { name: "🆔 User ID", value: `${user.id}`, inline: true },
            { name: "📅 วันที่", value: `${new Date()}` },
          ],
          footer: {
            text: "🚀 ระบบแจ้งเตือนสมาชิกใหม่",
          },
        },
      ],
    });

    revalidatePath("/admin/users");
    return { success: true, message: "สมัครสมาชิกสำเร็จ" };
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("username")) {
      return { success: false, message: "มีผู้ใช้นี้แล้วในระบบ" };
    }

    console.error("Create user error:", error);
    return { success: false, message: "เกิดข้อผิดพลาดจากระบบ" };
  }
}

export async function Login(userData: any) {
  try {
    const user = await prisma.users.findFirst({
      where: {
        username: userData.username,
        websiteId: identifyWebsite,
      },
    });

    if (!user) {
      return {
        success: false, // <-- ต้องเป็น false
        message: "ไม่พบผู้ใช้นี้ในระบบ",
      };
    }

    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch) {
      return {
        success: false,
        message: "รหัสผ่านไม่ถูกต้อง",
      };
    }

    const plainUser = {
      ...user,
      points: Number(user.points),
      totalPoints: Number(user.totalPoints),
    };

    return {
      success: true,
      user: plainUser, // <-- MyUser พร้อม expiredDate
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "เกิดข้อผิดพลาดจากระบบ",
    };
  }
}

export async function ChangePassword(userData: {
  userId: string; // เรามั่นใจแล้วว่ามีค่ามาจาก frontend
  oldPassword: string;
  newPassword: string;
}) {
  try {
    const canuse = await requireUser();
    if (!canuse) {
      return { success: false, message: "ไม่สามารถใช้งานได้" };
    }
    const session = await getServerSession(authOptions);
    if (session?.user.id !== userData.userId) {
      return { success: false, message: "อะไรครับเนี่ย" };
    }
    const user = await prisma.users.findUnique({
      where: { id: userData.userId, websiteId: identifyWebsite },
    });

    if (!user) {
      return { success: false, message: "ไม่พบผู้ใช้" };
    }

    const isMatch = await bcrypt.compare(userData.oldPassword, user.password);
    if (!isMatch) {
      return { success: false, message: "รหัสผ่านเดิมไม่ถูกต้อง" };
    }

    const isSamePassword = await bcrypt.compare(
      userData.newPassword,
      user.password,
    );
    if (isSamePassword) {
      return {
        success: false,
        message: "รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม",
      };
    }
    // ---

    const hashedPassword = await bcrypt.hash(userData.newPassword, 10);

    await prisma.users.update({
      where: { id: user.id, websiteId: identifyWebsite },
      data: { password: hashedPassword },
    });

    return { success: true, message: "เปลียนรหัสผ่านสำเร็จ" };
  } catch (error) {
    console.error("Change Password Error:", error);

    // --- (แก้ไขจุดนี้) ---
    // โยน error ต่อเพื่อให้ toast.promise รับได้
    if (error instanceof Error) {
      // โยน message ที่เรากำหนดเอง (เช่น "รหัสผ่านเดิมไม่ถูกต้อง")
      return { success: false, message: error.message };
    }

    // สำหรับ error ที่ไม่คาดคิดอื่นๆ (เช่น DB ล่ม)
    return { success: false, message: "เกิดข้อผิดพลาดจากระบบ" };
    // ---
  }
}

type GetAllUsersResult =
  | { success: true; data: Array<any> }
  | { success: false; data: []; message: string };

export async function getAllUsers(): Promise<GetAllUsersResult> {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return { success: false, data: [], message: "คุณไม่มีสิทธิ์เข้าถึง" };
    }

    const users = await prisma.users.findMany({
      where: { websiteId: identifyWebsite },
    });

    return { success: true, data: users };
  } catch (error) {
    console.log("getAllUsers Error:", error);
    return { success: false, data: [], message: "เกิดข้อผิดพลาดฝั่งเซิฟเวอร์" };
  }
}

interface updateUser {
  id: string;
  points: number;
  totalPoints: number;
  role: string;
}

export async function updateUser(data: updateUser) {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    await prisma.users.update({
      where: { id: data.id, websiteId: identifyWebsite },
      data: {
        points: data.points,
        totalPoints: data.totalPoints,
        role: data.role,
      },
    });
    await upgradeClass(data.id);
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "แก้ไขผู้ใช้สำเร็จ",
    };
  } catch (error) {
    console.log("updateUser Error: ", error);
    return { success: false, message: "เกิดข้อผิดพลาดจากระบบ" };
  }
}

export async function deleteUSer(id: string) {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
      };
    }
    await prisma.users.delete({
      where: { id: id },
    });
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "ลบผู้ใช้สำเร็จ",
    };
  } catch (error) {
    console.log("deleteUSer Error: ", error);
    return { success: false, message: "เกิดข้อผิดพลากจากระบบ" };
  }
}

export async function TopupByWallet(id: string | undefined, url: string) {
  const topupStatus = await walletTopup(url);
  try {
    const canuse = await requireUser();
    if (!canuse) {
      return { success: false, message: "ไม่สามารถใช้งานได้" };
    }
    if (!topupStatus.status || !id) {
      return {
        success: false,
        message: topupStatus.reason,
      };
    }

    const user = await prisma.users.update({
      where: { id: id, websiteId: identifyWebsite },
      data: {
        points: {
          increment: topupStatus.amount ?? 0,
        },
      },
    });

    await prisma.historyTopup.create({
      data: {
        amount: topupStatus.amount,
        topupType: "ทรูวอลเลท",
        userId: id,
        reason: "เติมเงินจากระบบ",
        websiteId: identifyWebsite,
      },
    });

    await upgradeClass(user.id);

    await sendDiscordWebhook({
      username: "ระบบการเงิน",
      embeds: [
        {
          title: "💰 มีรายการเติมเงิน!",
          description: "ผู้ใช้ได้ทำการเติมเงินเข้าสู่ระบบ",
          color: 2299548,
          fields: [
            { name: "👤 ผู้ใช้", value: `${user.username}`, inline: true },
            { name: "🆔 User ID", value: `${user.id}`, inline: true },
            {
              name: "💵 จำนวนเงิน",
              value: `${topupStatus.amount} ฿`,
              inline: false,
            },
            {
              name: "📺 ช่องทางการเติมเงิน",
              value: `ทรูมันนี่วอลเลท(ซองอั่งเปา)`,
              inline: false,
            },
            { name: "⏳ เวลาทำรายการ", value: `${new Date()}` },
          ],
          footer: {
            text: "💸 ระบบแจ้งเตือนการเติมเงิน",
          },
        },
      ],
    });
    revalidatePath("/admin/users");
    return {
      success: false,
      message: `เติมเงินจำนวน ${topupStatus.amount ?? 0} บาท สำเร็จ`,
    };
  } catch (error) {
    console.log("Topup Error: ", error);
    return {
      success: false,
      message: topupStatus.reason ?? "เกิดข้อผิดพลาดจากระบบ",
    };
  }
}

export async function TopupByBank(id: string | undefined, qrCode: string) {
  const res = await TopupBank(qrCode);

  const canuse = await requireUser();
  if (!canuse) {
    return { success: false, message: "ไม่สามารถใช้งานได้" };
  }

  if (!res || !id) {
    return {
      success: false,
      message: res.message,
    };
  }

  if (res.code !== "200200") {
    return {
      success: false,
      message: res.message,
    };
  }

  try {
    const user = await prisma.users.update({
      where: { id, websiteId: identifyWebsite },
      data: {
        points: { increment: res.data.amount ?? 0 },
      },
    });

    await upgradeClass(user.id);

    await prisma.historyTopup.create({
      data: {
        amount: res.data.amount,
        reason: "เติมเงินจากระบบ",
        topupType: "ธนาคาร",
        userId: id,
        websiteId: identifyWebsite,
      },
    });

    revalidatePath("/admin/users");

    await sendDiscordWebhook({
      username: "ระบบการเงิน",
      embeds: [
        {
          title: "💰 มีรายการเติมเงิน!",
          description: "ผู้ใช้ได้ทำการเติมเงินเข้าสู่ระบบ",
          color: 2299548,
          fields: [
            { name: "👤 ผู้ใช้", value: `${user.username}`, inline: true },
            { name: "🆔 User ID", value: `${user.id}`, inline: true },
            {
              name: "💵 จำนวนเงิน",
              value: `${res.data.amount} ฿`,
              inline: false,
            },
            {
              name: "📺 ช่องทางการเติมเงิน",
              value: `ธนาคาร(เช็คสลิป)`,
              inline: false,
            },
            { name: "⏳ เวลาทำรายการ", value: `${new Date()}` },
          ],
          footer: {
            text: "💸 ระบบแจ้งเตือนการเติมเงิน",
          },
        },
      ],
    });

    return {
      success: true,
      message: `เติมเงินจำนวน ${res.data.amount} บาท สำเร็จ`,
    };
  } catch (error) {
    console.log("TopupByBank DB Error:", error);
    return {
      success: false,
      message: res.message ?? "เกิดข้อผิดพลาดจากระบบ",
    };
  }
}

export async function getUserById(id: string) {
  try {
    const canuse = await requireUser();
    if (!canuse) {
      return {
      id: "",
      username: "",
      role: "",
      points: 0,
      totalPoints: 0,
      userClassName: "",
      classId: "",
      createdAt: new Date(),
    };
    }
    const user = await prisma.users.findUnique({
      where: { id: id, websiteId: identifyWebsite },
      select: {
        id: true,
        username: true,
        role: true,
        points: true,
        totalPoints: true,
        userClassName: true,
        createdAt: true,
        classId: true,
      },
    });
    if (!user) {
      return {
        id: "",
        username: "",
        role: "",
        points: 0,
        totalPoints: 0,
        userClassName: "",
        classId: "",
        createdAt: new Date(),
      };
    }

    return user;
  } catch (error) {
    console.log("getUserById: ", error);
    return {
      id: "",
      username: "",
      role: "",
      points: 0,
      totalPoints: 0,
      userClassName: "",
      classId: "",
      createdAt: new Date(),
    };
  }
}

export async function TopupByCode(id: string | undefined, key: string) {
  const canuse = await requireUser().catch(() => false);
  if (!canuse) return { success: false, message: "ไม่สามารถใช้งานได้" };

  if (!id) return { success: false, message: "ไม่พบผู้ใช้สำหรับการเติมโค้ด" };

  try {
    const result = await prisma.$transaction(async (tx) => {
      const code = await tx.code.findUnique({
        where: { key, websiteId: identifyWebsite },
      });

      if (!code) return { success: false, message: "ไม่พบโค้ดในระบบ" };

      // ใช้เต็มแล้ว
      if (code.currentUse >= code.maxUse) {
        return {
          success: false,
          message: `จำนวนการใช้งานครบแล้ว ${code.currentUse}/${code.maxUse}`,
        };
      }

      // หมดอายุ
      if (new Date() > new Date(code.expired)) {
        return { success: false, message: "โค้ดนี้หมดอายุแล้ว" };
      }

      // ห้ามใช้ซ้ำ (ครั้งเดียวต่อ user)
      if (!code.canDuplicateUse) {
        const isUsed = await tx.historyCode.findFirst({
          where: { userId: id, codeId: code.id, websiteId: identifyWebsite },
        });
        if (isUsed) return { success: false, message: "คุณใช้โค้ดนี้ไปแล้ว" };
      }

      const reward = Number(code.reward);

      const user = await tx.users.update({
        where: { id, websiteId: identifyWebsite },
        data: { points: { increment: reward } },
      });

      await tx.code.update({
        where: { key, websiteId: identifyWebsite },
        data: { currentUse: { increment: 1 } },
      });

      await tx.historyCode.create({
        data: { userId: id, codeId: code.id, websiteId: identifyWebsite },
      });

      return {
        success: true,
        message: `เติมโค้ดสำเร็จ คุณได้รับพ้อยท์จำนวน ${reward} บาทแล้ว`,
        reward,
        user: {
          ...user,
          points: Number(user.points),
          totalPoints: Number(user.totalPoints),
        },
      };
    });

    // ถ้า transaction บอกว่าไม่สำเร็จ ก็คืนกลับไปเลย (ไม่ต้องทำ 500)
    if (!result.success) return result;

    // ส่ง webhook “หลัง” สำเร็จ (ถ้าส่งไม่ผ่าน ไม่ควรทำให้เติมเงินล้ม)
    sendDiscordWebhook({
      username: "ระบบการเงิน",
      embeds: [
        {
          title: "💰 มีรายการเติมเงินจากโค้ด!",
          color: 2299548,
          fields: [
            { name: "👤 ผู้ใช้", value: result?.user?.username },
            { name: "💵 จำนวนเงิน", value: `${result.reward} ฿` },
            { name: "🔑 โค้ด", value: key },
          ],
        },
      ],
    }).catch(() => {});

    return result;
  } catch (err) {
    console.log("TopupByCode Error:", err);
    return { success: false, message: "เกิดข้อผิดพลาดในระบบ" };
  }
}
