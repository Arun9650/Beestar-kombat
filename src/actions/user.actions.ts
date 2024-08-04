"use server";

import { Team } from "@/components/tasks/TaskList";
import prisma from "@/lib/prisma";

export async function getUserConfig(id: string) {
  console.log("🚀 ~ getUserConfig ~ id:", id)


  
  const user = await prisma.user.findUnique({ where: { chatId: id } });

  //   if (!user) throw new Error("COuld not find user");
  if (!user)
    return {
      user: {
        recharge: 0,
        clicks: 0,
        capacity: 0,
      },
    };

  return {
    user: {
      recharge: user.refillRate,
      clicks: user.pointPerTap,
      capacity: user.rechargeLimit,
    },
  };
}

export async function creditProfitPerHour(id: string) {
  console.log("🚀 ~ creditProfitPerHour ~ id:", id)
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
export async function updateProfitPerHour(id: string, profitPerHour: number, cost: number) {
  console.log("🚀 ~ creditProfitPerHour ~ id:", id)
  const user = await prisma.user.findUnique({ where: { chatId: id } });
  try {
    

      await prisma.user.update({
        where: { chatId: id },
        data: { profitPerHour: {increment:  profitPerHour }, points: {decrement:  cost} },
      });
    
  } catch (e) {
    console.log(e);
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