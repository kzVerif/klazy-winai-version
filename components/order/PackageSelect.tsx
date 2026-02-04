"use client";
import { MagicWand02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function PackageSelect({ packages, selectedPackage, onSelect }: {packages: any, selectedPackage: any, onSelect: any}) {
  return (
    <>
      <div className="bg-neutral-50 border border-neutral-300 rounded-xl p-6 space-y-4">
        <h2 className="flex gap-2 text-lg font-semibold text">
          <HugeiconsIcon icon={MagicWand02Icon} strokeWidth={2} />
          เลือกแพ็คสินค้า
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {packages?.map((item: any) => {
            const isActive = selectedPackage?.id === item.id;

            return (
              <button
                onClick={() => onSelect(item)}
                className={`relative px-6 py-5 rounded-xl cursor-pointer hover:border-emerald-600 hover:scale-[1.01] hover:shadow-md transition-all ease-in-out ${
                  isActive
                    ? "border-2 border-emerald-600 bg-emerald-50 text-emerald-800 shadow"
                    : "bg-white border-2"
                }`}
                key={item.id}
              >
                <div className="flex justify-between items-center font-semibold">
                  <div>{item.name}</div>
                  <div className="text">
                    {item.isDiscount && (
                      <span
                        className="
                            absolute flex -top-2 right-4
                            bg-emerald-500 text-white
                            text-xs font-semibold
                            px-2 py-0.5 rounded-full
                            shadow
                          "
                      >
                        🔥ลดราคา
                      </span>
                    )}
                    {item.isDiscount ? (
                      <>
                        <span className="text-sm text-neutral-400 line-through">
                          ฿{item.price}
                        </span>
                        <span> ฿ {item.priceDiscount}</span>
                      </>
                    ) : (
                      <span>฿ {item.price}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
