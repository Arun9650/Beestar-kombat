"use server";

import prisma from "@/lib/prisma";

export interface Bonus {
  id?: string;
  name: string;
  count: number;
  icon: string;
}

export async function allDailyBonuses(): Promise<
  Bonus[] | "noBonusFound" | "errorOccurred"
> {
  try {
    const bonuses = await prisma.dailyBoosters.findMany();
    if (!bonuses) {
      return "noBonusFound";
    }
    return bonuses;
  } catch (e) {
    console.log(e);
    return "errorOccurred";
  }
}




const dailyRewards = [
  { day: 1, reward: 500 },
  { day: 2, reward: 1000 },
  { day: 3, reward: 2500 },
  { day: 4, reward: 5000 },
  { day: 5, reward: 15000 },
  { day: 6, reward: 25000 },
  { day: 7, reward: 100000 },
  { day: 8, reward: 500000 },
  { day: 9, reward: 1000000 },
  { day: 10, reward: 5000000 },
];

export const claimReward = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('Missing userId');
    }

    const today = new Date();
    const lastReward = await prisma.dailyReward.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    let day = 1;
    if (lastReward) {
      const lastRewardDate = new Date(lastReward.createdAt);
      const differenceInDays = Math.floor((today.getTime() - lastRewardDate.getTime()) / (1000 * 60 * 60 * 24));
      if (differenceInDays === 1) {
        day = lastReward.day + 1;
      } else if (differenceInDays > 1) {
        day = 1;
      }
    }

    const reward = dailyRewards.find(r => r.day === day)?.reward || dailyRewards[dailyRewards.length - 1].reward;

    await prisma.dailyReward.create({
      data: { userId, day, coins: reward }
    });

    await prisma.user.update({
      where: { chatId: userId },
      data: { points: { increment: reward } }
    });

    return { success: true, reward };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to claim reward' };
  }
};

export const checkRewardStatus = async (userId:string) => {
  try {
    if (!userId) {
      throw new Error('Missing userId');
    }

    const today = new Date();
    const lastReward = await prisma.dailyReward.findFirst({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });

    let nextRewardAvailable = true;
    if (lastReward && new Date(lastReward.createdAt).toDateString() === today.toDateString()) {
      nextRewardAvailable = false;
    }

    return { nextRewardAvailable, lastReward };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to check reward status' };
  }
};



export const referUser = async (referrerChatId:string, referredChatId:string, referredUserName:string) => {
  try {
    // Find the referrer by chatId
    const referrer = await prisma.user.findUnique({ where: { chatId: referrerChatId } });
    if (!referrer) {
      throw new Error('Referrer not found');
    }

    // Check if the referred user already exists
    let referredUser = await prisma.user.findUnique({ where: { chatId: referredChatId } });
    if (referredUser) {
      throw new Error('User already exists');
    }

    // Create the new user
    referredUser = await prisma.user.create({
      data: {
        chatId: referredChatId,
        name: referredUserName,
        referredById: referrer.id,
      },
    });

    // Create a referral record
    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: referredUser.id,
      },
    });

    // Reward both users
    const reward = 5000; // Example reward amount
    await prisma.user.updateMany({
      where: {
        OR: [{ id: referrer.id }, { id: referredUser.id }],
      },
      data: {
        points: {
          increment: reward,
        },
      },
    });

    return { success: true, reward };
  } catch (error) {
    console.error(error);
    return { success: false, error: error || 'Failed to refer user' };
  }
};