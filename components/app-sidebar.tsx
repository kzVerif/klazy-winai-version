import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare02Icon,
  UserEdit01Icon,
  Package01Icon,
  ShoppingCart01Icon,
  MoneyReceiveSquareIcon,
  Settings02Icon,
  ThumbsUpIcon,
  TransactionHistoryIcon,
  SourceCodeIcon,
  YoutubeIcon,
  RankingIcon,
  Analytics02Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "แดชบอร์ด",
    url: "/admin/dashboard",
    icon: DashboardSquare02Icon,
  },
   {
    title: "รายงานยอดขาย",
    url: "/admin/report",
    icon: Analytics02Icon,
  },
  {
    title: "ตั้งค่าทั่วไป",
    url: "/admin/commonsetting",
    icon: Settings02Icon,
  },
  {
    title: "จัดการผู้ใช้",
    url: "/admin/users",
    icon: UserEdit01Icon,
  },
  {
    title: "จัดการสินค้า",
    url: "/admin/products",
    icon: ShoppingCart01Icon,
  },
  {
    title: "จัดการแอปพรีเมียม",
    url: "/admin/apppremium",
    icon: YoutubeIcon,
  },

  // 👉 ออเดอร์ / พรีออเดอร์ ควรเป็นแนว "แพ็กเกจ"
  {
    title: "จัดการสินค้าออเดอร์",
    url: "/admin/orders",
    icon: Package01Icon,
  },

  {
    title: "จัดการหมวดหมู่",
    url: "/admin/categories",
    icon: Package01Icon,
  },

  {
    title: "แนะนำสินค้า",
    url: "/admin/suggestproducts",
    icon: ThumbsUpIcon,
  },

  {
    title: "ตั้งค่าการเติมเงิน",
    url: "/admin/topupsetting",
    icon: MoneyReceiveSquareIcon,
  },

  {
    title: "ตั้งค่าโค้ดเติมเงิน",
    url: "/admin/code",
    icon: SourceCodeIcon,
  },

  {
    title: "ตั้งค่าโค้ดส่วนลด",
    url: "/admin/discountcode",
    icon: SourceCodeIcon,
  },

  {
    title: "ตั้งค่าระบบคลาส",
    url: "/admin/classrank",
    icon: RankingIcon,
  },

  // ----------------------
  // History zone
  // ----------------------

  // 👉 ประวัติการเงิน = ธุรกรรม
  {
    title: "ประวัติการเติมเงิน",
    url: "/admin/historytopup",
    icon: TransactionHistoryIcon,
  },

  // 👉 ประวัติการซื้อสินค้า = ตะกร้า
  {
    title: "ประวัติการสั่งซื้อสินค้าทั่วไป",
    url: "/admin/historybuy",
    icon: ShoppingCart01Icon,
  },

  // 👉 ประวัติแอปพรีเมียม = ยังผูกกับแพลตฟอร์ม
  {
    title: "ประวัติการสั่งซื้อแอปพรีเมี่ยม",
    url: "/admin/historyapp",
    icon: YoutubeIcon,
  },

  // 👉 พรีออเดอร์ = แพ็กเกจ
  {
    title: "ประวัติการสั่งซื้อสินค้าพรีออเดอร์",
    url: "/admin/historyorder",
    icon: Package01Icon,
  },

  {
    title: "ประวัติการใช้งานโค้ดเติมเงิน",
    url: "/admin/historycode",
    icon: Package01Icon,
  },

  {
    title: "ประวัติการใช้งานโค้ดส่วนลด",
    url: "/admin/historydiscountcode",
    icon: Package01Icon,
  },
];

export function AppSidebar({ logo }: { logo: string | null }) {
  return (
    <Sidebar className="top-0 z-50 h-full">
      <SidebarContent>
        <SidebarGroup className="gap-y-4">
          <SidebarGroupLabel className="py-3 text-lg">
            <Image
              src={
                logo ??
                "https://img5.pic.in.th/file/secure-sv1/ksrv-logo-trans.png"
              }
              width={32}
              height={32}
              alt="KSRV Logo"
              className="rounded-full mr-1"
            />
            จัดการร้านค้า
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-y-2">
              {items.map((item: any) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className=" text-lg">
                      <HugeiconsIcon icon={item.icon} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
