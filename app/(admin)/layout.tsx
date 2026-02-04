import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getShopSettings } from "@/lib/database/setting";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 60;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setting = await getShopSettings();
  const session = await getServerSession(authOptions);

  if (session?.user.role.toLowerCase() !== "admin") {
    return redirect("/");
  }
  return (
    <SidebarProvider>
      <AppSidebar logo={setting?.logo ?? ""} />

      <main className="header-admin container">
        {/* Header bar */}
        <div className="flex-col items-center justify-between mb-4 border-b-2 py-4">
          <div className="">
            <SidebarTrigger className="max-w-3xs" />
          </div>
        </div>

        <div className="">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
