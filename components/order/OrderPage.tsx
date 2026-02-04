"use client";
import { useState } from "react";
import PackageSelect from "./PackageSelect";
import UserInfoForm from "./UserInfoForm";
import DialogConfirmPurchase from "./DialogConfirmPurchase";

export default function OrderPage({ packages }: { packages: any }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userInfo, setUserInfo] = useState({
    id_user: "",
    password_user: "",
    contact_user: "",
  }); 

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
        <UserInfoForm userInfo={userInfo} setUserInfo={setUserInfo} />
        <PackageSelect
          packages={packages}
          selectedPackage={selectedPackage}
          onSelect={setSelectedPackage}
        />
      </div>
      <DialogConfirmPurchase selectedPackage={selectedPackage} userInfo={userInfo} />
    </>
  );
}
