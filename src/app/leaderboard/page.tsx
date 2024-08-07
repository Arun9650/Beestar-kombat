"use client";
// pages/leaderboard.js
import React, { useEffect, useState } from "react";
import { beeAvatar, MainBee } from "../../../public/newImages";
import Image from "next/image";
import { getLeaderboard } from "@/actions/user.actions";
import { usePointsStore } from "@/store/PointsStore";



const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<
    { points: number; name: string | null; chatId: string }[] | []
  >([]);

  const [levelIndex, setLevelIndex] = useState(6);
  const { points, PPH } = usePointsStore();
  const [userName , setUserName] = useState('Honey Collector');
  
  
  const levelNames = [
    "Bronze", // From 0 to 4999 coins
    "Silver", // From 5000 coins to 24,999 coins
    "Gold", // From 25,000 coins to 99,999 coins
    "Platinum", // From 100,000 coins to 999,999 coins
    "Diamond", // From 1,000,000 coins to 2,000,000 coins
    "Epic", // From 2,000,000 coins to 10,000,000 coins
    "Legendary", // From 10,000,000 coins to 50,000,000 coins
    "Master", // From 50,000,000 coins to 100,000,000 coins
    "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
    "Lord", // From 1,000,000,000 coins to ∞
  ];
  
  const levelMinPoints = [
    0, // Bronze
    5000, // Silver
    25000, // Gold
    100000, // Platinum
    1000000, // Diamond
    2000000, // Epic
    10000000, // Legendary
    50000000, // Master
    100000000, // GrandMaster
    1000000000, // Lord
  ];

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    console.log("🚀 ~ calculateProgress ~ progress:", progress)
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const userName = window.localStorage.getItem("userName");
      setUserName(userName!);
      const response = await getLeaderboard();
      if (response.leaderboard) {
        setLeaderboardData(response.leaderboard);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-black bg-opacity-60 backdrop-blur-none rounded-t-3xl top-glow border-t-4 border-[#f3ba2f]  from-purple-800 to-black text-white">
      <div className="p-4 flex flex-col items-center">
        <div className="relative">
          <Image
            src={MainBee}
            alt="Epic Hamster"
            className="w-32 h-32 mx-auto"
          />
         
        </div>
        <h1 className="text-4xl font-bold mt-4">{levelNames[levelIndex]}</h1>
        <p className="text-xl">{levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p>
          <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
            <div
              className="progress-gradient h-2 rounded-full"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        <div className="mt-8 w-full">
          {leaderboardData.map((user, index) => (
            <div
              key={index}
              className="flex items-center bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none p-4 overflow-y-auto rounded-lg mt-2"
            >
              <Image
                src={beeAvatar}
                alt={"beeavatar"}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div className="flex-1">
                <p className="font-bold">
                  {user.name ? user.name : "honey Collector"}
                </p>
                <p className="text-yellow-500">{user.points}</p>
              </div>
              <div className="text-lg">{index + 1}</div>
            </div>
          ))}
        </div>
        <div>
          <div className=" fixed bottom-20   w-[90%] left-1/2 transform -translate-x-1/2 flex items-center bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none p-4 overflow-y-auto rounded-lg mt-2">
            <Image
              src={beeAvatar}
              alt={"user"}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-1">
              <p className="font-bold">{userName ? userName: "honey Collector"}</p>
              <p className="text-yellow-500">{PPH}</p>
            </div>
            <div className="text-lg">{points}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
