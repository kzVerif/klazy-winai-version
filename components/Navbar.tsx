"use client";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BitcoinBagIcon,
  Cancel01Icon,
  Contact01Icon,
  Home07Icon,
  LogoutSquare02Icon,
  Menu01Icon,
  MoneyReceiveSquareIcon,
  Setting07Icon,
  Settings05Icon,
  Store01Icon,
  TransactionHistoryIcon,
  UserEdit01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { useSession, signOut } from "next-auth/react";
import { useUser } from "@/contexts/UserContext";

export default function Navbar({ setting }: { setting: any }) {
  const { data: session } = useSession();
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!session?.user;
  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.role === "stocker" ||
    session?.user?.role === "orderer" ||
    session?.user?.role === "seller";
  const points = user?.points || 0;
  
  const backend = user?.role === "admin" ? "/admin/dashboard" : 
                  user?.role === "stocker" ? "/stocker" :
                  user?.role === "orderer" ? "/orderer" : 
                  user?.role === "seller" ? "/seller" : "";

  return (
    <nav className="bg-white shadow-md py-3 sticky top-0 z-50 border-b border-gray-100 w-full">
      <div className="container flex justify-between items-center">
        {/* --- โลโก้ --- */}
        <Link href={"/"}>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src={setting.logo} width={60} height={60} alt="Logo" className="rounded-full" />
          </div>
        </Link>

        {/* --- เมนูหลัก (Desktop) --- */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/"><button className="flex items-center button-underline pb-1 gap-1"><HugeiconsIcon icon={Home07Icon} /> หน้าแรก</button></Link>
          <Link href="/categories"><button className="flex items-center button-underline pb-1 gap-1"><HugeiconsIcon icon={Store01Icon} /> สินค้าทั้งหมด</button></Link>
          <Link href="/topup"><button className="flex items-center button-underline pb-1 gap-1"><HugeiconsIcon icon={MoneyReceiveSquareIcon} /> เติมเงิน</button></Link>
          <Link href={`${setting.contact}`} target="_blank"><button className="flex items-center button-underline pb-1 gap-1"><HugeiconsIcon icon={Contact01Icon} /> ติดต่อเรา</button></Link>
        </div>

        {/* --- ฝั่งขวา (ปุ่มโปรไฟล์เดิม + Hamburger) --- */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-accent transition bg-gray-100">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={UserIcon} />
                      <span className="hidden sm:inline font-semibold tracking-wide">{session?.user?.username}</span>
                    </div>
                    <div className="flex items-center gap-1 border-l pl-3">
                      <Badge className="bg-(--color-primary) text-white font-semibold px-2 py-0.5 rounded-md">{points} ฿</Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex items-center gap-2 text-gray-500 text-sm"><HugeiconsIcon icon={Setting07Icon} /> จัดการบัญชีของคุณ</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile"><DropdownMenuItem className="gap-2"><HugeiconsIcon icon={UserIcon} /> โปรไฟล์ของคุณ</DropdownMenuItem></Link>
                  <Link href="/changepassword"><DropdownMenuItem className="gap-2"><HugeiconsIcon icon={UserEdit01Icon} /> เปลี่ยนรหัสผ่าน</DropdownMenuItem></Link>
                  <Link href="/history"><DropdownMenuItem className="gap-2"><HugeiconsIcon icon={TransactionHistoryIcon} /> ประวัติการสั่งซื้อ</DropdownMenuItem></Link>
                  {/* ✅ ประวัติการเติมเงิน (Dropdown) */}
                  <Link href="/historytopup"><DropdownMenuItem className="gap-2"><HugeiconsIcon icon={TransactionHistoryIcon} /> ประวัติการเติมเงิน</DropdownMenuItem></Link>
                  {isAdmin && <Link href={backend}><DropdownMenuItem className="gap-2"><HugeiconsIcon icon={Settings05Icon} /> จัดการร้านค้า</DropdownMenuItem></Link>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500 gap-2" onClick={() => signOut({ callbackUrl: "/" })}><HugeiconsIcon icon={LogoutSquare02Icon} /> ออกจากระบบ</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="md:hidden">
                <Button variant="ghost" onClick={() => setMenuOpen(!menuOpen)}>
                  {menuOpen ? <HugeiconsIcon icon={Cancel01Icon} /> : <HugeiconsIcon icon={Menu01Icon} />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login"><button className="btn btn-login">เข้าสู่ระบบ</button></Link>
              <Link href="/register"><button className="btn btn-register">สมัครสมาชิก</button></Link>
            </div>
          )}
        </div>
      </div>

      {/* --- Mobile Menu --- */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
          <div className="flex flex-col items-start gap-3 px-6 py-4">
            <Link href="/" onClick={() => setMenuOpen(false)}><button className="flex items-center gap-2 button-underline pb-1"><HugeiconsIcon icon={Home07Icon} /> หน้าแรก</button></Link>
            <Link href="/categories" onClick={() => setMenuOpen(false)}><button className="flex items-center gap-2 button-underline pb-1"><HugeiconsIcon icon={Store01Icon} /> สินค้าทั้งหมด</button></Link>
            <Link href="/topup" onClick={() => setMenuOpen(false)}><button className="flex items-center gap-2 button-underline pb-1"><HugeiconsIcon icon={MoneyReceiveSquareIcon} /> เติมเงิน</button></Link>
            <Link href={`${setting.contact}`} target="_blank"><button className="flex items-center gap-2 button-underline pb-1"><HugeiconsIcon icon={Contact01Icon} /> ติดต่อเรา</button></Link>
            
            {isLoggedIn && (
              <div className="w-full border-t pt-3 mt-1 flex flex-col gap-3 text-gray-600">
                <p className="text-[10px] font-bold text-gray-400 uppercase">จัดการบัญชี</p>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2"><HugeiconsIcon icon={UserIcon} size={20} /> โปรไฟล์ของคุณ</Link>
                <Link href="/history" onClick={() => setMenuOpen(false)} className="flex items-center gap-2"><HugeiconsIcon icon={TransactionHistoryIcon} size={20} /> ประวัติการสั่งซื้อ</Link>
                {/* ✅ ประวัติการเติมเงิน (Mobile Ham) */}
                <Link href="/historytopup" onClick={() => setMenuOpen(false)} className="flex items-center gap-2"><HugeiconsIcon icon={TransactionHistoryIcon} size={20} /> ประวัติการเติมเงิน</Link>
                {isAdmin && <Link href={backend} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-blue-600 font-medium"><HugeiconsIcon icon={Settings05Icon} size={20} /> จัดการร้านค้า</Link>}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}