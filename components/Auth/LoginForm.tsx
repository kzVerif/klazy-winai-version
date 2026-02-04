"use client";

import { useEffect, useState } from "react";
import { UserIcon, LockIcon, Login02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast"; // ใช้ toast แจ้ง error/success (optional)
import { useRouter } from "next/navigation";
export default function LoginForm() {
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    setLoading(false);
    if (res?.error) {
      toast.error(res.error || "เข้าสู่ระบบไม่สำเร็จ");
    } else if (res?.ok) {
      toast.success("เข้าสู่ระบบสำเร็จ!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
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
              required
              id="username"
              name="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-gray-800 text-sm
                         placeholder:text-gray-400 "
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
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-gray-800 text-sm
                         placeholder:text-gray-400 "
            />
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-main p-2 flex items-center justify-center gap-1"
        >
          <HugeiconsIcon icon={Login02Icon} />
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>

      {/* Register Link */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <Link href={"/register"}>
          <Badge
            variant={"secondary"}
            className="text-xs text-gray-500 text-center hover:underline cursor-pointer p-1"
          >
            คลิ๊กที่นี่เพื่อไปหน้าสร้างบัญชี
          </Badge>
        </Link>
      </div>
    </div>
  );
}
