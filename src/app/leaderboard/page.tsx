// pages/leaderboard.js
import React from 'react';
import { beeAvatar, MainBee } from '../../../public/newImages';
import Image from 'next/image';

const leaderboardData = [
  { name: 'قهرمان پویا', icon: '/user-icon.png', score: '4,102,465', rank: 1 },
  { name: 'Muhammad Ahmad', icon: '/user-icon.png', score: '3,606,610', rank: 2 },
  { name: 'John Doe', icon: '/user-icon.png', score: '3,605,666', rank: 3 },
  { name: 'Reyhan', icon: '/user-icon.png', score: '3,438,416', rank: 4 },
  { name: 'Hassan Ali', icon: '/user-icon.png', score: '3,000,000', rank: 5 },

];

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b  from-purple-800 to-black text-white">
      <div className="p-4 flex flex-col items-center">
        <div className="relative">
          <Image src={MainBee} alt="Epic Hamster" className="w-32 h-32 mx-auto" />
          <button className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full">&lt;</button>
          <button className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full">&gt;</button>
        </div>
        <h1 className="text-4xl font-bold mt-4">Epic</h1>
        <p className="text-xl">6.07M / 10M</p>
        <div className="w-full bg-gray-800 rounded-full h-4 mt-4">
          <div className="bg-green-500 h-4 rounded-full" style={{ width: '60%' }}></div>
        </div>
        <div className="mt-8 w-full">
          {leaderboardData.map((user, index) => (
            <div key={user.rank} className="flex items-center bg-gray-900 p-4 overflow-y-auto rounded-lg mt-2">
              <img src={user.icon} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
              <div className="flex-1">
                <p className="font-bold">{user.name}</p>
                <p className="text-yellow-500">{user.score}</p>
              </div>
              <div className="text-lg">{user.rank}</div>
            </div>
          ))}
        </div>
        <div>
        <div  className=" fixed bottom-20 border  w-[90%] left-1/2 transform -translate-x-1/2 flex items-center bg-gray-900 p-4 overflow-y-auto rounded-lg mt-2">
              <Image src={beeAvatar} alt={"user"} className="w-10 h-10 rounded-full mr-4" />
              <div className="flex-1">
                <p className="font-bold">{"Arun" }</p>
                <p className="text-yellow-500">{"50000"}</p>
              </div>
              <div className="text-lg">{"1000000+"}</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
