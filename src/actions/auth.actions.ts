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
  chatId: string, name: string, referredByUser?: string
): Promise<"success" | "accountAlreadyExist" | "unknownError"> {
  try {
    const chatExist = await prisma.user.findUnique({
      where: { chatId, lastProfitDate: Date.now() },
    });
    if (chatExist) return "accountAlreadyExist";



    if (referredByUser) {
      const referredUser = await prisma.user.findUnique({ where: { chatId: referredByUser } });
      if (referredUser) {
        await prisma.user.update({ where: { chatId: referredByUser }, data: { points: { increment: 5000 } , referralCount: {increment : 1} } });
        await prisma.bonuster.create({ data: { chatId: referredByUser, energy: 100 } });
        await prisma.user.create({ data: { chatId, points: 5000, name } });
        await prisma.bonuster.create({ data: { chatId, energy: 100 } });
      }
      await prisma.user.create({ data: { chatId, points: 5000, name } });
      await prisma.bonuster.create({ data: { chatId, energy: 100 } });
    }else {
      await prisma.user.create({ data: { chatId, points: 0, name } });
      await prisma.bonuster.create({ data: { chatId, energy: 500 } });
    }

    return "success";
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

export async function authenticateUserOrCreateAccount({
  chatId,
  userName,
  referredByUser
}: {
  chatId: string;
  userName: string;
  referredByUser?: string;
}): Promise<"success" | "unknownError" | "accountCreationFailed"> {
  try {
    const userAuth = await authenticateUser({ chatId });
    if (userAuth === "userNotFound") {
      await createAccount(chatId, userName,   referredByUser);
    }

    const account = await prisma.user.findUnique({ where: { chatId } });
    console.log("🚀 ~ account:", account)
    if (!account) return "accountCreationFailed";
    return "success";
  } catch (e) {
    console.log(e);
    return "unknownError";
  }
}
