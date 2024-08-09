"use server";

import { Team } from "@/components/tasks/TaskList";
import prisma from "@/lib/prisma";

export async function getUserConfig(id: string) {

  const user = await prisma.user.findUnique({ where: { chatId: id } });

  if (!user)
    return {
      user: {
        recharge: 0,
        clicks: 0,
        capacity: 0,
        profit: 0,
        profitPerHour: 0,
        lastProfitDate: 0,
        points: 0,
        name: '',
      },
    };

  return {
    user: {
      recharge: user.refillRate,
      clicks: user.pointPerTap,
      capacity: user.rechargeLimit,
      profit: user.profit,
      profitPerHour: user.profitPerHour,
      lastProfitDate: user.lastProfitDate,
      points: user.points,
      name: user.name,
    },
  };
}

export async function creditProfitPerHour(id: string) {
  const user = await prisma.user.findUnique({ where: { chatId: id } });
  try {
    if (!user?.lastProfitDate) {
      await prisma.user.update({
        where: { chatId: id },
        data: { lastProfitDate: Date.now() },
      });

      return "success";
    } else {
      const pph = user.profitPerHour;
      const now = Date.now();
      const lastProfitDate = user.lastProfitDate;
      const timeDiffInMilliSeconds = Math.abs(now - lastProfitDate);
      const hrs = timeDiffInMilliSeconds / (1000 * 60 * 60);

      const profitMade = pph * hrs;

      await prisma.user.update({
        where: { chatId: id },
        data: { points: profitMade, lastProfitDate: now },
      });
      return { profit: profitMade, success: true };
    }
    
  } catch (e) {
    console.log(e);
    return { success: false, message: 'An error occurred while updating the profit per hour' }
  }
}
export async function updateProfitPerHour(id: string, selectedTeam: Team) {
  const user = await prisma.user.findUnique({ where: { chatId: id } });

  if (!user) {
    return { success: false, message: 'User not found' };
  }

  try {
    const purchaseCard = await prisma.userCard.findUnique({
      where: { id: selectedTeam.id },
    });
    const increasedBaseCost = selectedTeam.baseCost * 1.2;
    const increasedBasePPH = selectedTeam.basePPH * 1.05;
    const remainingPoints = user.points - selectedTeam.baseCost;
    if (purchaseCard) {
      await prisma.user.update({
        where: { chatId: id },
        data: {
          profitPerHour: { increment: selectedTeam.basePPH },
          points:  remainingPoints ,
        },
      });

      await prisma.userCard.update({
        where: { id: selectedTeam.id },
        data: { baseLevel: { increment: 1 }, 
          basePPH:  increasedBasePPH ,
          baseCost:  increasedBaseCost  },
      });





      return { success: true, message: 'Card updated successfully' };
    } else {
      const increasedBaseCost = selectedTeam.baseCost * 1.5;
      const increasedBasePPH = selectedTeam.basePPH * 1.25;
      await prisma.userCard.create({
        data: {
          cardId: selectedTeam.id,
          title: selectedTeam.title,
          image: selectedTeam.image,
          baseLevel: 1,
          basePPH: increasedBasePPH,
          baseCost: increasedBaseCost,
          userId: id,
          category: selectedTeam.category,
        },
      });

      await prisma.user.update({
        where: { chatId: id },
        data: {
          profitPerHour: { increment: selectedTeam.basePPH },
          points: { decrement: selectedTeam.baseCost },
        },
      });

      return { success: true, message: 'Card created and user updated successfully' };
    }
  } catch (e) {
    console.error(e);
    return { success: false, message: 'An error occurred while updating the profit per hour' };
  }
}



export const getLeaderboard = async () => {
  try {
    const leaderboard = await prisma.user.findMany({
      orderBy: {
        points: 'desc',
      },
      select: {
        points: true,
        chatId: true,
        name: true,
      },
      take: 10, // Adjust this number to get more or fewer users
    });

    return { success: true, leaderboard };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to fetch leaderboard' };
  }
};


export const DeleteUser = async (userId:string) => {
  try {
    const user = await prisma.user.delete({
      where : {chatId:userId}
    })

    return { success: true}
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to fetch Delete Account' };
    
  }
}