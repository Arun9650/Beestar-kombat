"use server";

import { Team } from "@/components/tasks/TaskList";
import prisma from "@/lib/prisma";

export async function getUserConfig(id: string) {

  const user = await prisma.user.findUnique({ where: { chatId: id } });

  const userEnergy = await prisma.bonuster.findUnique({
    where: { chatId: id },
  });

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
        multiClickLevel: 1,
        multiClickCost: 500,
        
      },
    };

  return {
    user: {
      recharge: user.refillRate,
      clicks: user.pointPerTap,
      capacity: userEnergy?.energy,
      multiClickLevel: userEnergy?.multiClickLevel,
      multiClickCost: userEnergy?.multiClickCost,
      profit: user.profit,
      profitPerHour: user.profitPerHour,
      lastProfitDate: user.lastProfitDate,
      points: user.points,
      name: user.name,
      lastLogin: user.lastLogin
    },
  };
}

export async function creditProfitPerHour(id: string) {
  const user = await prisma.user.findUnique({ where: { chatId: id } });
  try {
    if (!user?.lastProfitDate) {
      await prisma.user.update({
        where: { chatId: id },
        data: { lastProfitDate: Date.now(), lastLogin: new Date() },
      });

      return "success";
    } else {
      const pph = user.profitPerHour;
      const now = Date.now();
      const lastProfitDate = user.lastProfitDate;
      const timeDiffInMilliSeconds = Math.abs(now - lastProfitDate);
      let hrs = timeDiffInMilliSeconds / (1000 * 60 * 60);

      if (hrs > 3) {
        hrs = 3;
      }


      const profitMade = pph * hrs;

      if(profitMade > 0){

        await prisma.user.update({
          where: { chatId: id },
          data: { points: {increment: profitMade}, lastProfitDate: now },
        });
      }
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
    const increasedBaseCost = Math.floor(selectedTeam.baseCost * 1.2);
    const increasedBasePPH = Math.floor(selectedTeam.basePPH * 1.05);
    const remainingPoints = Math.max(user.points - selectedTeam.baseCost, 0);

    if (purchaseCard && remainingPoints > 0) {
      await prisma.user.update({
        where: { chatId: id },
        data: {
          profitPerHour: { increment: selectedTeam.basePPH },
          points:  remainingPoints ,
       lastProfitDate: Date.now(), lastLogin: new Date() 
        },
      });

      await prisma.userCard.update({
        where: { id: selectedTeam.id },
        data: { baseLevel: { increment: 1 }, 
          basePPH:  increasedBasePPH ,
          baseCost:  (increasedBaseCost)  },
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
        profitPerHour: true,
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


     await prisma.userAchievement.deleteMany({
      where : {userId}
    })

    await prisma.userCard.deleteMany({
      where : {userId}
    })

    await prisma.tasksCompletion.deleteMany({
      where : {userId}
    })

    await prisma.bonuster.deleteMany({
      where : {chatId:userId}
    })

    await prisma.userSkin.deleteMany({
      where : {userId:userId}
    })

    await prisma.dailyReward.deleteMany({
      where : {userId:userId}
    })

     await prisma.user.delete({
      where : {chatId:userId}
    })

    return { success: true}
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to fetch Delete Account' };
    
  }
}


export const UpdateUser = async (userId:string) => {
try {
  await prisma.user.update({
    where : {chatId:userId},
    data : {
      lastLogin : new Date(),
    }
  })
  return { success: true}
} catch (error) {
  return { success: false, error: 'Failed to fetch Update Account' };
}
}