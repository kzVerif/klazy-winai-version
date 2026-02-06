"use client"
import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export function CustomTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // กันการเปลี่ยนหน้าถ้าเผลอไปใส่ใน Link
        toggleSidebar();
      }}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-all",
        className
      )}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
}