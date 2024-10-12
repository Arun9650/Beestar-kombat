"use server";

import { Team } from "@/components/tasks/TaskList";
import prisma from "@/lib/prisma";
import redis from '@/lib/redis'
export async function getUserConfig(id: string) {

  const user = await prisma.user.findUnique({ where: { chatId: id } });
  console.log("🚀 ~ getUserConfig ~ user:", user)

  const userEnergy = await prisma.bonuster.findUnique({
    where: { chatId: id },
  });
  console.log("🚀 ~ getUserConfig ~ userEnergy:", userEnergy)

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
        league: 'Bronze',
        energyCost:1000,
        energyLevel:1
        
      },
      userDetails: null,
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
      lastLogin: user.lastLogin,
      league: user.league,
      energyCost: userEnergy?.energyCost ?? 0,
      energyLevel: userEnergy?.energylevel,
      
    },
    userDetails: user,
  };
}

export async function creditProfitPerHour(id: string, lastLoginTime: number | null) {
  const user = await prisma.user.findUnique({ where: { chatId: id } });
  console.log("🚀 ~ creditProfitPerHour ~ user:", user)
  try {

    if(!user) return;


    if (!user?.lastProfitDate) {
      await prisma.user.update({
        where: { chatId: id },
        data: { lastProfitDate: Date.now(), lastLogin: new Date() },
      });

      return { profit: 0, success: true };
    } else {
      const pph = user.profitPerHour;
      const now = Date.now();
      const lastProfitDate = lastLoginTime || user.lastLogin.getTime();
      const timeDiffInMilliSeconds = Math.abs(now - lastProfitDate);
     // Convert the time difference to seconds
      let seconds = timeDiffInMilliSeconds / 1000;
      
      // Cap the seconds to the equivalent of 3 hours (3 hours * 3600 seconds/hour)
      const maxSeconds = 3 * 60 * 60;
      seconds = Math.min(seconds, maxSeconds);
      
      // Calculate the profit made per second
      const profitPerSecond = pph / 3600; // since pph is profit per hour, divide by 3600 to get profit per second
      const profitMade = profitPerSecond * seconds;

      if(profitMade > 0){

    const user =     await prisma.user.update({
          where: { chatId: id },
          data: { points: {increment: profitMade}, lastProfitDate: now , lastLogin: new Date() },
        });
      console.log("🚀 ~ creditProfitPerHour ~ user:", user)
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
       // Ensure the user has enough points to proceed
       if (user.points < selectedTeam.baseCost) {
        return { success: false, message: 'Insufficient points to purchase the card' };
      }
      
    const increasedBaseCost = Math.floor(selectedTeam.baseCost * 2);
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
      const increasedBaseCost = selectedTeam.baseCost * 2;
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




export const getLeaderboard = async ({
  league,
  page = 1,
  limit = 100,
  points
}: {
  league: string;
  page?: number;
  limit?: number;
  points:number
}) => {
  try {
    const offset = (page - 1) * limit;

        // Define the points filter conditionally based on the points value
        const pointsFilter = points < 1000000000
        ? { lt: points, gte: 0 } // Points should be less than the provided value and greater than or equal to 0
        : { gte: 0 };            // No upper limit, but ensure points are >= 0
  

    const leaderboard = await prisma.user.findMany({
      where: {
        league: league, // Filter users by league
        ...(pointsFilter && { points: pointsFilter }), // Conditionally include points filter
      },
      orderBy: {
        points: 'desc',
      },
      select: {
        points: true,
        chatId: true,
        name: true,
        profitPerHour: true,
        league: true,
      },
      skip: offset,
      take: limit, // Limit the number of users returned
    });

    // Get total number of users in the league for pagination
    const totalUsers = await prisma.user.count({
      where: {
        league: league,
      },
    });

    return { success: true, leaderboard, totalUsers };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to fetch leaderboard' };
  }
};



export const DeleteUser = async (userId:string) => {
  try {


    const user = await prisma.user.findUnique({ where: { chatId: userId } });

    await prisma.user.updateMany({
      where: {
        referredById: user?.id,  // The user ID you want to delete
      },
      data: {
        referredById: null,
        // referralCount: { decrement: 1 },
      },
    });

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

    await prisma.youTubeCompletion.deleteMany({
      where : {userId:userId}
    })

      // Invalidate relevant Redis caches
      const userCardsKey = `userCards:${userId}`;
      const userCardsExists = await redis.exists(userCardsKey);
  
      if (userCardsExists) {
        await redis.del(userCardsKey); // Invalidate user's card cache
      }
  
      await redis.del('allCards'); // I

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