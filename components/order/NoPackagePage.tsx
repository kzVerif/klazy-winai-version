import { ShoppingBag03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function NoPackagePage() {
  return (
    <div className="flex flex-col items-center justify-center container header gap-6 text-4xl text-neutral-500">
        <HugeiconsIcon icon={ShoppingBag03Icon} strokeWidth={1}  size={96} />
        ไม่พบแพ็คสินค้า
    </div>
  )
}