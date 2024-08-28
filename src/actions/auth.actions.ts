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
        // await prisma.bonuster.create({ data: { chatId: referredByUser, energy: 500 } });
        await prisma.user.create({ data: { chatId, points: 5000, name , referredById: referredByUser} });
        await prisma.bonuster.create({ data: { chatId, energy: 500 } });
        return "createdByReferral";
      } else {
        await prisma.user.create({ data: { chatId, points: 5000, name } });
        await prisma.bonuster.create({ data: { chatId, energy: 500 } });
        return "created";
      }
      
    } else {
      await prisma.user.create({ data: { chatId, points: 0, name } });
      await prisma.bonuster.create({ data: { chatId, energy: 500 } });
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

export async function updateProfile(
  data: User2
): Promise<"success" | "unknownError" | "userNotExist"> {
  try {
    const user = await prisma.user.findUnique({
      where: { chatId: data.chatId },
    });
    if (!user) return "userNotExist";

    await prisma.user.update({ where: { chatId: data.chatId }, data });

    return "success";
  } catch (e) {
    console.log(e);
    return "unknownError";
  }
}
