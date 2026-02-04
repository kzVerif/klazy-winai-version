import { Calling02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function FloatingButton() {
  return (
    <button
      className="
        fixed bottom-6 left-6
        text-(--color-primary)
        bg-(--color-primary-light)
        p-5 rounded-full cursor-pointer
        shadow-[0_8px_20px_rgba(0,0,0,0.15)]
        border border-(--color-primary)
        hover:scale-110 hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)]
        transition-all duration-300 ease-out
      "
    >
      <HugeiconsIcon icon={Calling02Icon} size={32} />
    </button>
  );
}
