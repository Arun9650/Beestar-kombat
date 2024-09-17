"use server";

import prisma from "@/lib/prisma";

export type League = {
  name: string;
  minEntry: number;
  trophy: string;
  entryReward: number;
  pointLimit: number;
};

export async function leagueData(): Promise<{
  level: number;
  current: string;
}> {
  return { level: 1200, current: "pilot" };
}



export async function updatePointsInDB({
  points,
  id,
}: {
  points: number;
  id: string;
}): Promise<"success" | "unknownError" | "userNotExist"> {
  try {
    const user = await prisma.user.findUnique({ where: { chatId: id } });

    if (!user) return "userNotExist";

    if (points > 0){
 
      
      await prisma.user.update({ where: { chatId: id }, data: { points:  points,  lastProfitDate: Date.now(), lastLogin: new Date()  } });
      
    }
    
    return "success";
  } catch (e) {
    console.log(e);
    return "unknownError";
  }
}

// export async function getPoints (id: string){
//   const user = await prisma.user.findUnique({ where})
// }
