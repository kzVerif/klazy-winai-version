import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 60;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 1. ดึง role ออกมาอย่างปลอดภัย (ใส่ ?. ให้ครบ กันเว็บพัง)
  const userRole = session?.user?.role?.toLowerCase();

  // 2. กำหนด Role ที่อนุญาตให้เข้าหน้านี้ได้
  const allowedRoles = ["admin", "seller", "stocker"];

  // 3. เช็ค logic: "ถ้าไม่มี role" หรือ "role ไม่อยู่ในกลุ่มที่อนุญาต" -> เด้งออก
  if (!userRole || !allowedRoles.includes(userRole)) {
    return redirect("/");
  }

  return (
    <main className="container header">
      <div className="">{children}</div>
    </main>
  );
}
