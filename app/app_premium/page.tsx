import AppList from "@/components/AppPremium/AppList";
import { getAllAppPremiumProducts, getStatusAppremiumForUser } from "@/lib/database/apppremium";
import { redirect } from "next/navigation";

export default async function Page() {
  const res = await fetch("https://byshop.me/api/product");
  const products = await res.json();
  const apps = await getAllAppPremiumProducts();
  const statusApp = await getStatusAppremiumForUser()

  if (!statusApp.status) {
   return redirect("/"); 
  }

  return (
    <div className="container header">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text">
          รายการสินค้า App Premium
        </h1>
        <h2 className="text-sm text-gray-500">
          เลือกรายการสินค้า App Premiumm ที่ต้องการได้เลย
        </h2>
      </div>

      <AppList products={products} apps={apps}/>
    </div>
  );
}
