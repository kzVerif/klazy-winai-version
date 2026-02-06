import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react"; // เพิ่ม icon ลูกศร
import {
  Analytics02Icon,
  DashboardSquare02Icon,
  Settings02Icon,
  ShoppingCart01Icon,
  SourceCodeIcon,
  TransactionHistoryIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";

const menuGroups = [
  {
    title: "ภาพรวม",
    items: [
      {
        title: "แดชบอร์ด",
        url: "/admin/dashboard",
        icon: DashboardSquare02Icon,
      },
      { title: "รายงานยอดขาย", url: "/admin/report", icon: Analytics02Icon },
    ],
  },
  {
    title: "จัดการระบบ",
    icon: Settings02Icon,
    subItems: [
      { title: "ตั้งค่าทั่วไป", url: "/admin/commonsetting" },
      { title: "จัดการผู้ใช้", url: "/admin/users" },
      { title: "ตั้งค่าการเติมเงิน", url: "/admin/topupsetting" },
      { title: "ตั้งค่าระบบคลาส", url: "/admin/classrank" },
    ],
  },
  {
    title: "จัดการสินค้า",
    icon: ShoppingCart01Icon,
    subItems: [
      { title: "สินค้าทั้งหมด", url: "/admin/products" },
      { title: "หมวดหมู่", url: "/admin/categories" },
      { title: "แอปพรีเมียม", url: "/admin/apppremium" },
      { title: "สินค้าพรีออเดอร์", url: "/admin/orders" },
      { title: "แนะนำสินค้า", url: "/admin/suggestproducts" },
    ],
  },
  {
    title: "โค้ดส่วนลด & เติมเงิน",
    icon: SourceCodeIcon,
    subItems: [
      { title: "โค้ดเติมเงิน", url: "/admin/code" },
      { title: "โค้ดส่วนลด", url: "/admin/discountcode" },
    ],
  },
  {
    title: "ประวัติทำรายการ",
    icon: TransactionHistoryIcon,
    subItems: [
      { title: "ประวัติการเติมเงิน", url: "/admin/historytopup" },
      { title: "ประวัติสั่งซื้อทั่วไป", url: "/admin/historybuy" },
      { title: "ประวัติแอปพรีเมี่ยม", url: "/admin/historyapp" },
      { title: "ประวัติพรีออเดอร์", url: "/admin/historyorder" },
      { title: "ประวัติการใช้โค้ด", url: "/admin/historycode" },
    ],
  },
];

export function AppSidebar({ logo }: { logo: string | null }) {
  return (
    <Sidebar className="top-0 z-50 h-full">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-6 text-lg">
            <Image
              src={
                logo ??
                "https://img5.pic.in.th/file/secure-sv1/ksrv-logo-trans.png"
              }
              width={32}
              height={32}
              alt="Logo"
              className="rounded-full mr-2"
            />
            จัดการร้านค้า
          </SidebarGroupLabel>

          <SidebarMenu>
            {menuGroups.map((group) => {
              // ถ้ามี items (กลุ่มเมนูเดี่ยว)
              if (group.items) {
                return group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link href={item.url} className="text-[16px]">
                        <HugeiconsIcon icon={item.icon} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ));
              }

              // ถ้ามี subItems (ทำเป็น Dropdown/Collapsible)
              return (
                <Collapsible
                  key={group.title}
                  asChild
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={group.title}
                        className="text-[16px]"
                      >
                        {group.icon && <HugeiconsIcon icon={group.icon} />}
                        <span>{group.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {group.subItems?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
