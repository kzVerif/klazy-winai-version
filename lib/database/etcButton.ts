"use server"
import { addYears } from "date-fns";
import prisma from "./conn";
import { requireAdmin } from "../requireAdmin";
const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default_site";

export async function getAllEtcButton() {
    const etc = await prisma.etcButton.findMany({
        where:{
            websiteId: identifyWebsite
        }
    });
    return etc;
}

export async function updateEtcButton(data: any) {
   const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ"
    }
  }

    const updatedEtc = await prisma.etcButton.updateMany({
        where: { id: data.id, websiteId: identifyWebsite },
        data: { ...data },
    });

    return updatedEtc;
}

export async function getEtcButtonSetting() {
    try {
        const setting = await prisma.etcButtonSetting.findUnique({where:{websiteId: identifyWebsite}});
        if(setting) {
            return setting;
        } else {
            const newSetting = await prisma.etcButtonSetting.create({
                data:{
                    websiteId: identifyWebsite,
                    isOpen:false
                }
            })
            return newSetting;
        }
    } catch (error) {
        console.log("error getEtcButtonSetting:", error)
        return {
            id:"null",
            isOpen:false
        }
    }
}

export async function updatedEtcButtonSetting(data:any) {
   const canUse = await requireAdmin();
  if (!canUse) {
    return {
      success: false,
      message: "ไม่สำเร็จ"
    }
  }

    try{
        const setting = await prisma.etcButtonSetting.update({
            where:{
                id:data.id,
                websiteId: identifyWebsite
            },data:{
                isOpen:data.isOpen
            }

        })
    } catch(error) {
        console.log("error updateEtcButtonSetting:", error)
    }
}
