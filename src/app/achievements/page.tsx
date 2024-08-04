// pages/achievements.js
import React from 'react';
import { card1, card2, card3, card4, card5, collectionCoins1, collectionCoins2, collectionCoins3, collectionCoins4, collectionCoins5, shield1, shield2, shield3, shield4, shield5 } from '../../../public/newImages';
import Image from 'next/image';

const achievements = [
  {
    category: 'Upgrade cards',
    milestones: [
      { name: '10 cards', icon: card1, unlocked: true },
      { name: '25 cards', icon: card2, unlocked: false },
      { name: '50 cards', icon: card3, unlocked: false },
      { name: '200 cards', icon: card4, unlocked: false },
      { name: '500 cards', icon: card5, unlocked: false },
    ],
  },
  {
    category: 'Upgrade cards to level 15',
    milestones: [
      { name: '1 card', icon: shield1, unlocked: true },
      { name: '5 cards', icon: shield2, unlocked: false },
      { name: '10 cards', icon: shield3, unlocked: false },
      { name: '25 cards', icon: shield4, unlocked: false },
      { name: '50 cards', icon: shield5, unlocked: false },
    ],
  },
  {
    category: 'Upgrade cards to level 25',
    milestones: [
      { name: '1 card', icon: shield1, unlocked: true },
      { name: '5 cards', icon: shield2, unlocked: false },
      { name: '10 cards', icon: shield3, unlocked: false },
      { name: '25 cards', icon: shield4, unlocked: false },
      { name: '50 cards', icon: shield5, unlocked: false },
    ],
  },
  {
    category: 'Collect coins',
    milestones: [
      { name: '1M coins', icon: collectionCoins1, unlocked: true },
      { name: '10M coins', icon: collectionCoins2, unlocked: false },
      { name: '200M coins', icon: collectionCoins3, unlocked: false },
      { name: '1.5B coins', icon: collectionCoins4, unlocked: false },
      { name: '15B coins', icon: collectionCoins5, unlocked: false },
    ],
  },
  {
    category: 'Invite Friends',
    milestones: [
      { name: '1M coins', icon: collectionCoins1, unlocked: true },
      { name: '10M coins', icon: collectionCoins2, unlocked: false },
      { name: '200M coins', icon: collectionCoins3, unlocked: false },
      { name: '1.5B coins', icon: collectionCoins4, unlocked: false },
      { name: '15B coins', icon: collectionCoins5, unlocked: false },
    ],
  },
];

const Achievements = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4  flex items-center justify-between">
        <h1 className="text-lg font-bold mx-auto">Achievements</h1>
      </header>
      <main className="p-4 pb-8 bg-[#1d2025b7] rounded-t-3xl ">
        {achievements.map((achievement, index) => (
          <div key={index} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{achievement.category}</h2>
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
