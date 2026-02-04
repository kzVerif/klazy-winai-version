"use client";

import { useEffect, useState } from "react";
import { UserIcon, LockIcon, UserAdd02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import toast from "react-hot-toast";
import { createUser } from "@/lib/database/users";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function RegisterForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // รอ session โหลด
    if (session) {
      router.push("/"); // redirect ถ้า user login แล้ว
    }
  }, [session, status, router]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // const validate = () => {
  //   // Username 6-20 ตัว, ตัวอักษรและตัวเลข
  //   const usernameRegex = /^[a-zA-Z0-9]{6,20}$/;
  //   if (!usernameRegex.test(username)) {
  //     toast.error(
  //       "Username ต้องมี 6-20 ตัวอักษร และใช้ตัวอักษร A-Z, a-z, 0-9 เท่านั้น"
  //     );
  //     return false;
  //   }

  //   // Password: 8-32 ตัว, มีพิมพ์ใหญ่, พิมพ์เล็ก, ตัวเลข, special char
  //   const passwordRegex =
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,32}$/;
  //   if (!passwordRegex.test(password)) {
  //     toast.error(
  //       "Password ต้องมี 8-32 ตัวอักษร มีพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ (!@#$%^&*)"
  //     );
  //     return false;
  //   }

  //   // Confirm password ต้องตรงกับ password
  //   if (password !== confirm) {
  //     toast.error("รหัสผ่านไม่ตรงกัน");
  //     return false;
  //   }

  //   return true;
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!validate()) return;

    toast.loading("กำลังสมัครสมาชิก...");
    const status = await createUser({ username, password });
    toast.dismiss();

    if (!status.success) {
      return toast.error(status.message ?? "เกิดข้อผิดพลาดจากระบบ");
    }

    toast.success("สมัครสมาชิกสำเร็จ!");
    setTimeout(() => router.push("/login"), 1000);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <form className="space-y-4 mb-2" onSubmit={handleSubmit}>
        {/* Username */}
        <div className="space-y-1">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-700"
          >
            ชื่อผู้ใช้
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <HugeiconsIcon
                icon={UserIcon}
                className="w-4 h-4 text-gray-400"
              />
            </div>
            <input
              id="username"
              required
              name="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-gray-800 text-sm placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            รหัสผ่าน
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <HugeiconsIcon
                icon={LockIcon}
                className="w-4 h-4 text-gray-400"
              />
            </div>
            <input
              required
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-gray-800 text-sm placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label
            htmlFor="confirm"
            className="text-sm font-medium text-gray-700"
          >
            ยืนยันรหัสผ่าน
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <HugeiconsIcon
                icon={LockIcon}
                className="w-4 h-4 text-gray-400"
              />
            </div>
            <input
              required
              id="confirm"
              name="confirm"
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-gray-800 text-sm placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full btn-main p-2 flex items-center justify-center gap-1"
        >
          <HugeiconsIcon icon={UserAdd02Icon} />
          สมัครสมาชิก
        </button>
      </form>

      {/* Back to login */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <Link href={"/login"}>
          <Badge
            variant={"secondary"}
            className="text-xs text-gray-500 text-center hover:underline cursor-pointer p-1"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </Badge>
        </Link>
      </div>
    </div>
  );
}
