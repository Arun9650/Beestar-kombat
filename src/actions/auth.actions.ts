"use server";

import prisma from "@/lib/prisma";

export type User = {
  id: string;
  name: string | null;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User2 = Omit<User, "id, createdAt, updatedAt">;

export async function createAccount(
  chatId: string, 
  name: string, 
  referredByUser?: string
): Promise<"created" | "accountAlreadyExist" | "unknownError"| "createdByReferral"> {
  try {
    const chatExist = await prisma.user.findUnique({
      where: { chatId },
    });
    if (chatExist) return "accountAlreadyExist";

    if (referredByUser) {
      const referrer = await prisma.user.findUnique({ where: { chatId: referredByUser } });
      if (referrer) {
        await prisma.user.update({
          where: { chatId: referredByUser },
          data: {
            points: { increment: 5000 },
            referralCount: { increment: 1 }
          }
        });
        
        await prisma.user.create({ data: { chatId, points: 0, name , referredById: referrer.id, } });
        await prisma.bonuster.create({ data: { chatId, energy: 500, energyCost: 500, energylevel: 1 } });
        return "createdByReferral";
      } else {
      await prisma.user.create({ data: { chatId, points: 0, name } });
 
        await prisma.bonuster.create({ data: { chatId, energy: 500, energyCost: 500, energylevel: 1 } });
        return "created";
      }
      
    } else {
   const usr=    await prisma.user.create({ data: { chatId, points: 0, name } });
      console.log("🚀 ~ usr: 1277432329", usr)
      await prisma.bonuster.create({ data: { chatId, energy: 500, energyCost: 500, energylevel: 1 } });
    }

    return "created";
  } catch (e) {
    console.log(e);
    return "unknownError";
  }
}

export async function authenticateUser({
  chatId,
}: {
  chatId: string;
}): Promise<User | "userNotFound" | "unknownError"> {
  try {
    const user = await prisma.user.findUnique({ where: { chatId } });
    if (!user) return "userNotFound";
    return user;
  } catch (err) {
    return "unknownError";
  }
}

export async function authenticateUserOrCreateAccount({
  chatId,
  userName,
  referredByUser
}: {
  chatId: string;
  userName: string;
  referredByUser?: string;
}): Promise<"success" | "userAlreadyExists" | "createdNewAccount" | "unknownError" | "createdByReferral"> {
  try {
    const userAuth = await authenticateUser({ chatId });
    if (userAuth === "userNotFound") {
      const accountCreation = await createAccount(chatId, userName, referredByUser);
      console.log("🚀 ~ accountCreation: 1277432329", accountCreation)
      if (accountCreation === "created") return "createdNewAccount";
      if (accountCreation === "createdByReferral") return "createdByReferral";
      return "unknownError";
    } else if (userAuth !== "unknownError") {
      return "userAlreadyExists";
    } 

    return "unknownError";
  } catch (e) {
    console.log(e);
    return "unknownError";
  }
}





export async function fixAuthPointsIfGettingUnnecessary(id: string) {
  const user = await prisma.user.findUnique({ where: { chatId: id } });
  console.log("🚀 ~ fixAuthPointsIfGettingUnnecessary ~ user:", user?.chatId)

  if (!user) {
    return { success: false, message: 'User not found' };
  }

const updatedUser =  await prisma.user.update({
    where: { chatId: id },
    data: {
      points: 0,
    },
  });
console.log("🚀 ~ fixAuthPointsIfGettingUnnecessary ~ updatedUser:", updatedUser.points)
}