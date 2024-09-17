'use server';

import prisma from '@/lib/prisma';
import { DateTime } from 'luxon';

export interface Bonus {
	id?: string;
	name: string;
	count: number;
	icon: string;
}

export async function allDailyBonuses(): Promise<
	Bonus[] | 'noBonusFound' | 'errorOccurred'
> {
	try {
		const bonuses = await prisma.dailyBoosters.findMany();
		if (!bonuses) {
			return 'noBonusFound';
		}
		return bonuses;
	} catch (e) {
		console.log(e);
		return 'errorOccurred';
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
	{ day: 8, reward: 250000 },
	{ day: 9, reward: 500000 },
	{ day: 10, reward: 1000000 },
];

// Use Luxon for timezone handling

export const claimReward = async (userId: string, timezone: string) => {
	try {
		if (!userId) {
			throw new Error('Missing userId');
		}

		// Get the current date in the user's timezone
		const nowInUserTimezone = DateTime.now().setZone(timezone);
		const todayInUserTimezone = nowInUserTimezone.startOf('day'); // Start of the day (midnight)

		// Fetch the last reward claimed by the user
		const lastReward = await prisma.dailyReward.findFirst({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		});

		let day = 1;
		if (lastReward) {
			// Convert the last reward's createdAt timestamp to the user's timezone
			const lastRewardDateInUserTimezone = DateTime.fromJSDate(
				lastReward.createdAt
			)
				.setZone(timezone)
				.startOf('day');

			// Calculate the difference in days between the last reward date and today
			const differenceInDays = todayInUserTimezone.diff(
				lastRewardDateInUserTimezone,
				'days'
			).days;

			if (differenceInDays === 1) {
				// If the user claimed the reward yesterday, increment the day
				if (lastReward.day >= 10) {
					day = 1; // Reset to day 1 if it was the 10th day
				} else {
					day = lastReward.day + 1; // Move to the next reward day
				}
			} else if (differenceInDays > 1) {
				// Reset to day 1 if the user missed more than 1 day
				day = 1;
			} else {
				// If the reward has already been claimed today, return an error
				return { success: false, error: 'Reward already claimed for today' };
			}
		}

		// Find the reward for the current day or the last reward available
		const reward =
			dailyRewards.find((r) => r.day === day)?.reward ||
			dailyRewards[dailyRewards.length - 1].reward;

		// Create a new reward entry in the database
		await prisma.dailyReward.create({
			data: { userId, day, coins: reward },
		});

		// Update the user's points in the database
		await prisma.user.update({
			where: { chatId: userId },
			data: { points: { increment: reward } },
		});

		return { success: true, reward };
	} catch (error) {
		console.error(error);
		return { success: false, error: 'Failed to claim reward' };
	}
};

// Use Luxon for timezone handling

export const checkRewardStatus = async (userId: string, timezone: string) => {
	try {
		if (!userId) {
			throw new Error('Missing userId');
		}

		// Get the current date and time in the user's timezone
		const nowInUserTimezone = DateTime.now().setZone(timezone);
		const todayInUserTimezone = nowInUserTimezone.startOf('day'); // Start of the day (midnight)

		// Fetch the last reward claimed by the user
		const lastReward = await prisma.dailyReward.findFirst({
			where: { userId: userId },
			orderBy: { createdAt: 'desc' },
		});

		let nextRewardAvailable = true;
		if (lastReward) {
			// Convert the last reward's createdAt timestamp to the user's timezone
			const lastRewardDateInUserTimezone = DateTime.fromJSDate(
				lastReward.createdAt
			)
				.setZone(timezone)
				.startOf('day');

			// Compare the dates (ignoring time)
			if (
				lastRewardDateInUserTimezone.toMillis() ===
				todayInUserTimezone.toMillis()
			) {
				nextRewardAvailable = false;
			}
		}

		return { nextRewardAvailable, lastReward };
	} catch (error) {
		console.error(error);
		return { success: false, error: 'Failed to check reward status' };
	}
};

// export const referUser = async (referrerChatId:string, referredChatId:string, referredUserName:string) => {
//   try {
//     // Find the referrer by chatId
//     const referrer = await prisma.user.findUnique({ where: { chatId: referrerChatId } });
//     if (!referrer) {
//       throw new Error('Referrer not found');
//     }

//     // Check if the referred user already exists
//     let referredUser = await prisma.user.findUnique({ where: { chatId: referredChatId } });
//     if (referredUser) {
//       throw new Error('User already exists');
//     }

//     // Create the new user
//     referredUser = await prisma.user.create({
//       data: {
//         chatId: referredChatId,
//         name: referredUserName,
//         referredById: referrer.id,
//       },
//     });

//     // Create a referral record
//     await prisma.referral.create({
//       data: {
//         referrerId: referrer.id,
//         referredId: referredUser.id,
//       },
//     });

//     // Reward both users
//     const reward = 5000; // Example reward amount
//     await prisma.user.updateMany({
//       where: {
//         OR: [{ id: referrer.id }, { id: referredUser.id }],
//       },
//       data: {
//         points: {
//           increment: reward,
//         },
//       },
//     });

//     return { success: true, reward };
//   } catch (error) {
//     console.error(error);
//     return { success: false, error: error || 'Failed to refer user' };
//   }
// };

export const getAchievements = async () => {
	try {
		const categories = await prisma.achievementCategory.findMany({
			include: { milestones: true },
		});
		return { success: true, categories };
	} catch (error) {
		console.error(error);
		return { success: false, error: 'Failed to fetch achievements' };
	}
};

export const getUserAchievements = async (userId: string) => {
	try {
		const userAchievements = await prisma.userAchievement.findMany({
			where: { userId: userId },
			include: { milestone: { include: { category: true } } },
		});
		return { success: true, userAchievements };
	} catch (error) {
		console.error(error);
		return { success: false, error: 'Failed to fetch user achievements' };
	}
};

export const updateUserAchievement = async (
	userId: string,
	milestoneId: string
) => {
	try {
		const userAchievement = await prisma.userAchievement.create({
			data: {
				userId,
				milestoneId,
			},
		});

		await prisma.achievementMilestone.update({
			where: { id: milestoneId },
			data: { unlocked: true },
		});

		return { success: true, userAchievement };
	} catch (error) {
		console.error(error);
		return { success: false, error: 'Failed to update user achievement' };
	}
};

export const getAchievementsWithStatus = async (userId: string) => {
	try {
		const categories = await prisma.achievementCategory.findMany({
			include: { milestones: true },
		});

		const userAchievements = await prisma.userAchievement.findMany({
			where: { userId },
			include: {
				milestone: true,
			},
		});

		const userAchievementIds = userAchievements.map((ua) => ua.milestoneId);

		const categoriesWithStatus = categories.map((category) => ({
			...category,
			milestones: category.milestones.map((milestone) => ({
				...milestone,
				unlocked: userAchievementIds.includes(milestone.id),
			})),
		}));

		return { success: true, categories: categoriesWithStatus };
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error: 'Failed to fetch achievements with status',
		};
	}
};

export const creditEnergy = async (userId: string, amount: number, points: number) => {
	console.log('🚀 ~ creditEnergy ~ userId:', userId);

	try {
		const user = await prisma.user.findUnique({ where: { chatId: userId } });

		if (!user) {
			throw new Error('User not found');
		}

		// Check if the user has enough points before decrementing
		if (user.points < amount || points < amount) {
			return {
				success: false,
				message: 'Insufficient points to credit energy',
			};
		}

		await prisma.user.update({
			where: { chatId: userId },
			data: {
				points: {
					decrement: amount,
				},
			},
		});

		await prisma.bonuster.upsert({
			where: { chatId: userId },
			update: {
				energy: {
					increment: 500,
				},
				energyCost: {
					increment: amount,
				},
				energylevel: {
					increment: 1,
				},
			},
			create: {
				chatId: userId,
				energy: 500,
				multiClickLevel: 2,
				energyCost: 1000,
				energylevel: 2,
				multiClickCost: 1000,
			},
		});

		return { success: true, message: 'Energy credited successfully' };
	} catch (error) {
		console.error(error);
		return { success: false, error: 'Failed to credit energy' };
	}
};

export const creditMultiClickLevel = async (userId: string, amount: number) => {
	try {
		const user = await prisma.user.findUnique({ where: { chatId: userId } });
		if (!user) {
			throw new Error('User not found');
		}

		await prisma.user.update({
			where: { chatId: userId },
			data: {
				points: {
					decrement: amount,
				},
			},
		});

		await prisma.bonuster.upsert({
			where: { chatId: userId },
			update: {
				multiClickLevel: {
					increment: 1,
				},
				multiClickCost: {
					increment: amount,
				},
			},
			create: {
				chatId: userId,
				energy: 500,
				multiClickLevel: 2,
				multiClickCost: 1000,
				energyCost: 1000,
				energylevel: 2,
			},
		});

		return { success: true, message: 'MultiClickLevel credited successfully' };
	} catch (error) {
		console.error(error);
		return { success: false, error: 'Failed to credit MultiClickLevel' };
	}
};

export const getUserEnergy = async (userId: string) => {
	try {
		const user = await prisma.bonuster.findUnique({
			where: { chatId: userId },
		});

		if (!user) {
			throw new Error('User not found');
		}

		return { success: true, energy: user.energy };
	} catch (error) {
		console.error(error);
		return { success: false, error: 'Failed to get user energy', energy: 0 };
	}
};
