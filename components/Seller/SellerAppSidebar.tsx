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
  Package01Icon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "จัดการสินค้า",
    url: "/stocker/products",
    icon: ShoppingCart01Icon,
  },
  {
    title: "จัดการคิวพรีออเดอร์",
    url: "/stocker/products",
    icon: Package01Icon,
  },
];


export function SellerAppSidebar({logo} : {logo: string | null}) {
  return (
    <Sidebar className="top-0 z-50 h-full">
      <SidebarContent>
        <SidebarGroup className="gap-y-4">
          <SidebarGroupLabel className="py-3 text-lg">
            <Image
              src={logo ?? "https://img5.pic.in.th/file/secure-sv1/ksrv-logo-trans.png"}
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
