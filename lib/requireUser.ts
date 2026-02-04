// requireUser.ts หรือไฟล์อื่นๆ ที่ทำงานบน Server
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export async function requireUser() {
  // NextAuth จะพยายามอ่าน Cookie จาก Headers ในบริบทของ Server Component/Action
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error("UNAUTHORIZED");
  } 
}