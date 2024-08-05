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


// export async function claimDailyBonus(userId, ) {
//   try {

//     if (!userId) {
//       return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
//     }

//     const today = new Date();
//     const user = await prisma.user.findUnique({
//       where: { chatId:userId },
//     });

//     let nextRewardAvailable = true;
//     if (lastReward && lastReward.createdAt.toDateString() === today.toDateString()) {
//       nextRewardAvailable = false;
//     }

//     return new Response(JSON.stringify({ nextRewardAvailable, lastReward }), { status: 200 });
// }



