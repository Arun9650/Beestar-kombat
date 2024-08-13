"use server";

import prisma from "@/lib/prisma";

export type SkinType = {
  id?: string;
  name: string;
  image: string;
  profitPerHour?: number | null;
  cost: number;
  league?: string;
  featured?: boolean;
  owned?: boolean;
};

export async function createSkin({
  name,
  profitPerHour,
  image,
  league,
  cost,
}: SkinType): Promise<"success" | "unknownError"> {
  try {
    await prisma.skins.create({
      data: {
        name,
        cost: 100,
        image,
      },
    });

    return "success";
  } catch (e) {
    console.log(e);
    return "unknownError";
  }
}

export async function getSkins(): Promise<
  SkinType[] | "unknownError" | "skinNotFound"
> {
  try {
    const skins = await prisma.skins.findMany();
    if (!skins) return "skinNotFound";
    return skins;
  } catch (e) {
    console.log(e);
    return "unknownError";
  }
}

export async function getSkinById(
  id: string
): Promise<SkinType | "skinNotFound" | "unknownError"> {
  try {
    const skin = await prisma.skins.findUnique({ where: { id } });
    if (!skin) return "skinNotFound";
    return skin;
  } catch (e) {
    console.log(e);
    return "unknownError";
  }
}

export async function deleteSkin(
  id: string
): Promise<"success" | "unknonwnError"> {
  try {
    await prisma.skins.delete({ where: { id } });
    return "success";
  } catch (e) {
    return "unknonwnError";
  }
}

export async function skinBuy({
  id,
  localBalance,
  chatId,
}: {
  id: string;
  localBalance: number;
  chatId: string;
}): Promise<
  | { status: "success"; points: number; image: string }
  | { status: "errorOccurred" }
  | { status: "insufficientBalance" }
  | { status: "invalidUser" }
  | { status: "invalidSkin" }
> {
  try {
    const skin = await prisma.skins.findUnique({ where: { id } });
    const user = await prisma.user.findUnique({ where: { chatId } });
    const newBalance = localBalance - skin?.cost!;
    console.log("🚀 ~ newBalance:", newBalance)

    if (!user) return { status: "invalidUser" };
    if (!skin) return { status: "invalidSkin" };

    if (newBalance < 0) {
      return { status: "insufficientBalance" };
    } else {
      await prisma.user.update({
        where: { chatId },
        data: { points: newBalance },
      });


      await prisma.userSkin.create({
        data: {
          userId: chatId,
          skinId: id,
        },
      });

      return { points: newBalance, status: "success", image: skin.image };
    }
  } catch (e) {
    console.log("error while buying skin ", e);
    return { status: "errorOccurred" };
  }
}

export async function getCurrentSkin({ user }: { user: string }) {
  const acct = await prisma.user.findUnique({ where: { chatId: user } });

  const skin = acct?.skin;

  return skin;
}

export const SkinsToShow = async (userId: string) => {
  try {
    const userSkins = await prisma.userSkin.findMany({
      where: { userId },
    }) || []; 


    const allSkins = await prisma.skins.findMany();

    const userSkinsMap = new Map(userSkins.map((skin) => [skin.skinId, skin]));


    const combinedSkins = allSkins.map((skin) => ({
      ...skin,
      owned: userSkinsMap.has(skin.id),
    }));


    return { success: true, combinedSkins };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get user skins' };
  }
};


export async function getUserSkins(userId: string) {
  try {
    const userSkins = await prisma.userSkin.findMany({
      where: { userId },
    });

    return userSkins;
  } catch (error) {
    console.error("Error getting user skins",error);
    return [];
  }
}