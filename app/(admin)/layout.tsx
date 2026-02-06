import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";

import { getShopSettings } from "@/lib/database/setting";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { redirect } from "next/navigation";
import { CustomTrigger } from "@/components/CustomTrigger";

export const revalidate = 60;

export default async function Layout({ children }: { children: React.ReactNode }) {
  const setting = await getShopSettings();
  const session = await getServerSession(authOptions);

  if (session?.user.role.toLowerCase() !== "admin") {
    return redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar logo={setting?.logo ?? ""} />
      
      {/* ปรับ main ให้เป็น flex column */}
      <main className="flex flex-col flex-1 min-h-screen">
        {/* Header Bar สไตล์ Modern */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6 md:hidden">
          <CustomTrigger />
          <div className="h-4 w-[1px] bg-border" />
          <nav className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
            <span>จัดการร้านค้า</span>
          </nav>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 pt-6 container">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}