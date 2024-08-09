'use client'

// pages/achievements.js
import React, { useEffect, useState } from 'react';
import { card1, card2, card3, card4, card5, collectionCoins1, collectionCoins2, collectionCoins3, collectionCoins4, collectionCoins5, shield1, shield2, shield3, shield4, shield5 } from '../../../public/newImages';
import Image from 'next/image';
import { getAchievements, getAchievementsWithStatus, getUserAchievements, updateUserAchievement } from '@/actions/bonus.actions';

// const achievements = [
//   {
//     category: 'Upgrade cards',
//     milestones: [
//       { name: '10 cards', icon: card1, unlocked: true },
//       { name: '25 cards', icon: card2, unlocked: false },
//       { name: '50 cards', icon: card3, unlocked: false },
//       { name: '200 cards', icon: card4, unlocked: false },
//       { name: '500 cards', icon: card5, unlocked: false },
//     ],
//   },
//   {
//     category: 'Upgrade cards to level 15',
//     milestones: [
//       { name: '1 card', icon: shield1, unlocked: true },
//       { name: '5 cards', icon: shield2, unlocked: false },
//       { name: '10 cards', icon: shield3, unlocked: false },
//       { name: '25 cards', icon: shield4, unlocked: false },
//       { name: '50 cards', icon: shield5, unlocked: false },
//     ],
//   },
//   {
//     category: 'Upgrade cards to level 25',
//     milestones: [
//       { name: '1 card', icon: shield1, unlocked: true },
//       { name: '5 cards', icon: shield2, unlocked: false },
//       { name: '10 cards', icon: shield3, unlocked: false },
//       { name: '25 cards', icon: shield4, unlocked: false },
//       { name: '50 cards', icon: shield5, unlocked: false },
//     ],
//   },
//   {
//     category: 'Collect coins',
//     milestones: [
//       { name: '1M coins', icon: collectionCoins1, unlocked: true },
//       { name: '10M coins', icon: collectionCoins2, unlocked: false },
//       { name: '200M coins', icon: collectionCoins3, unlocked: false },
//       { name: '1.5B coins', icon: collectionCoins4, unlocked: false },
//       { name: '15B coins', icon: collectionCoins5, unlocked: false },
//     ],
//   },
//   {
//     category: 'Invite Friends',
//     milestones: [
//       { name: '1M coins', icon: collectionCoins1, unlocked: true },
//       { name: '10M coins', icon: collectionCoins2, unlocked: false },
//       { name: '200M coins', icon: collectionCoins3, unlocked: false },
//       { name: '1.5B coins', icon: collectionCoins4, unlocked: false },
//       { name: '15B coins', icon: collectionCoins5, unlocked: false },
//     ],
//   },
// ];

type AchievementCategory = {
  id: string;
  name: string;
  milestones: AchievementMilestone[];
};

type AchievementMilestone = {
  id: string;
  categoryId: string;
  name: string;
  icon: string;
  unlocked: boolean;
  // category: AchievementCategory;
};

type UserAchievement = {
  id: string;
  userId: string;
  milestoneId: string;
};



const Achievements = () => {
  // const [categories, setCategories] = useState([]);
  const [categories, setCategories] = useState<AchievementCategory[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  
  const [userId, setuserId] = useState<string | null>('');
  
useEffect(() => {
  const fetchAchievements = async () => {
    const userId = window.localStorage.getItem("authToken")
    setuserId(userId);
    const result = await getAchievementsWithStatus(userId!);

    if (result.success && result.categories) {
      setCategories(result.categories);
    }
  };

  fetchAchievements();
}, []);

const handleUpdateAchievement = async (milestoneId:string) => {
  const result = await updateUserAchievement(userId!, milestoneId);
  if (result.success && result.userAchievement) {
    setUserAchievements([...userAchievements, result.userAchievement]);
    setCategories(categories.map(category => ({
      ...category,
      milestones: category.milestones.map(milestone =>
        milestone.id === milestoneId ? { ...milestone, unlocked: true } : milestone
      )
    })));
  }
};



  return (
    <div className="min-h-screen top-glow border-t-4 pt-4  border-[#f3ba2f]  bg-black bg-opacity-60 backdrop-blur-none rounded-t-3xl  text-white">
      <header className="p-4  flex items-center justify-between">
        <h1 className="text-lg font-bold mx-auto">Achievements</h1>
      </header>
      <main className="p-4 pb-8  rounded-t-3xl bg-black/55 shadow-xl  bg-opacity-85 backdrop-blur-none ">
        {categories.map((achievement, index) => (
          <div key={index} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{achievement.name}</h2>
              <span className="text-gray-400">{achievement.milestones.filter(milestone => milestone.unlocked).length} cards</span>
            </div>
            <div className=" space-x-2 overflow-x-auto  grid grid-cols-5">
              {achievement.milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col justify-center  items-center bg-[#1d2025] h-20 rounded-lg ${milestone.unlocked ? '' : 'opacity-50'}`}>
                  <Image src={milestone.icon} alt={milestone.name} width={30} height={30} className="mb-2" />
                  <p className="text-center text-[10px] w-full min-w-full ">{milestone.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Achievements;
