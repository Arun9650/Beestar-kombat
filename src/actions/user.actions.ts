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
        data: { profit: profitMade, lastProfitDate: now },
      });
    }
  } catch (e) {
    console.log(e);
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
    if (purchaseCard) {
      await prisma.user.update({
        where: { chatId: id },
        data: {
          profitPerHour: { increment: selectedTeam.basePPH },
          points: { decrement: selectedTeam.baseCost  },
        },
      });

      await prisma.userCard.update({
        where: { id: selectedTeam.id },
        data: { baseLevel: { increment: 1 }, 
          basePPH: { increment: increasedBasePPH },
          baseCost: { increment: increasedBaseCost } },
      });

      return { success: true, message: 'Card updated successfully' };
    } else {
      const increasedBaseCost = selectedTeam.baseCost * 1.2;
      const increasedBasePPH = selectedTeam.basePPH * 1.05;
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

