"use server";

import { Team } from "@/components/tasks/TaskList";
import prisma from "@/lib/prisma";

export async function getUserConfig(id: string) {
  console.log("🚀 ~ getUserConfig ~ id:", id);

  const user = await prisma.user.findUnique({ where: { chatId: id } });

  //   if (!user) throw new Error("COuld not find user");
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
  console.log("🚀 ~ creditProfitPerHour ~ id:", id);
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
  console.log("🚀 ~ updateProfitPerHour ~ selectedTeam:", selectedTeam)
  console.log("🚀 ~ creditProfitPerHour ~ id:", id);
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
          profitPerHour: { increment: increasedBasePPH },
          points: { decrement: increasedBaseCost },
        },
      });

      await prisma.userCard.update({
        where: { id: selectedTeam.id },
        data: { baseLevel: { increment: 1 } },
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

// export async function purchaseCard(userid: string, cardItem: Team) {
//   // Find the card details
//   const card = await prisma.card2.findUnique({
//     where: { id: cardItem.id.toString() },
//   });

//   if (!card) {
//     throw new Error('Card not found');
//   }

//   if (card) {
//     // If the user already has the card, update its level and the user's PPH
//     const updatedLevel = card.baseLevel + 1;
//     const newPPH = card.basePPH * Math.pow(1.1, updatedLevel - 1); // Calculate the increment based on the new level

//     await prisma.card2.update({
//       where: {id: card.id},
//       data: { baseLevel: updatedLevel,
//         basePPH:
//         },
//     });

//     // Update user's current PPH
//     await prisma.user.update({
//       where: { chatId: userid },
//       data: { profitPerHour: { increment: newPPH - (card.basePPH * Math.pow(1.1, card.baseLevel - 1)) } }, // Increment based on the difference
//     });
//   } else {
//     // If the user doesn't have the card, create a new UserCard entry
//      await prisma.card2.create({
//       data: {
//         title: cardItem.name,
//         image: cardItem.image as string,
//         baseCost: cardItem.cost,
//         basePPH:cardItem.profit,
//         baseLevel: 1,
//         userId: userid,
//         cardType: "team",
//       },
//     });

//     // Update user's current PPH
//     await prisma.user.update({
//       where: { chatId: userid },
//       data: { profitPerHour: { increment: cardItem.profit },
//     points: { decrement:  cardItem.cost} },
//     });
//   }

// }
