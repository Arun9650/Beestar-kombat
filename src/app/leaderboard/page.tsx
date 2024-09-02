"use client";

import React, { useState } from "react";
import { beeAvatar } from "../../../public/newImages";
import Image from "next/image";
import { useLeaderboard } from "@/hooks/query/useLeaderBoard";
import { usePointsStore } from "@/store/PointsStore";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { useUserStore } from "@/store/userUserStore";

const Leaderboard = () => {
  const [page, setPage] = useState(1); // State to manage the current page
  const { user } = useUserStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const levelNames = [
    "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Epic", "Legendary", "Master", "GrandMaster", "Lord",
  ];
  const levelMinPoints = [0, 5000, 25000, 100000, 1000000, 2000000, 10000000, 50000000, 100000000, 1000000000];

  const league = levelNames[currentIndex]; // League based on current index

  const { data, isLoading, error } = useLeaderboard(league, page); // Fetch data with pagination and league filtering
  const { points } = usePointsStore();

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  };

  const calculateProgress = () => {
    if (user) {
      const leagueIndex = levelNames.findIndex((level) => level === user?.league);
      const currentLevelMin = levelMinPoints[leagueIndex];
      const nextLevelMin = levelMinPoints[leagueIndex + 1];
      const progress = ((points) / (currentLevelMin)) * 100;
  
      const cappedProgress = Math.min(progress, 100);
      return cappedProgress >= 0 ? cappedProgress : 0;
    }
    return 0;
  };
  

  const handleArrowClick = (direction: "left" | "right") => {
    if (direction === "left" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPage((old) => Math.max(old - 1, 1));
    } else if (direction === "right" && currentIndex < levelNames.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPage((old) => (data?.leaderboard?.length === 100 ? old + 1 : old));
    }
  };


  const userIndex = data?.leaderboard?.findIndex((level) => level.league === user?.league) ?? -1;
// If user is not on the list, set userIndex to a random number
const adjustedUserIndex = userIndex === -1 ? `${Math.floor(Math.random() * 9000) + 1001}+` : userIndex + 1  ;

  return (
    <div className="min-h-screen bg-black bg-opacity-60 backdrop-blur-none rounded-t-3xl top-glow border-t-4 border-[#f3ba2f] from-purple-800 to-black text-white">
      <div className="p-4 flex flex-col items-center">
        <div className="relative flex items-center gap-6">
          <SlArrowLeft
            onClick={() => handleArrowClick("left")}
            className={currentIndex === 0 ? "text-gray-500 font-bold" : "font-bold"}
          />
          <Image
            src={`/newImages/bee_avatars/${currentIndex + 1}.png`}
            alt={levelNames[currentIndex]}
            className="w-32 h-32 mx-auto"
            width={200}
            height={200}
          />
          <SlArrowRight
            onClick={() => handleArrowClick("right")}
            className={currentIndex === levelNames.length - 1 ? "text-gray-500 font-bold" : "font-bold"}
          />
        </div>
        <h1 className="text-4xl font-bold mt-4">{levelNames[currentIndex]}</h1>
        {levelNames[currentIndex] === user?.league ? (
          <p className="font-semibold text-[#95908a]">
            {formatNumber(points)} <span className="">/ {formatNumber(levelMinPoints[currentIndex])}</span>
          </p>
        ) : (
          <p className="font-semibold text-[#95908a]">from {formatNumber(levelMinPoints[currentIndex])}</p>
        )}
        {levelNames[currentIndex] === user?.league && (
          <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
            <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
          </div>
        )}
        <div className="mt-8 w-full pb-40">
          {isLoading ? (
            <p className="w-full text-center h-60">Loading... </p> // Loading spinner or message
          ) : error ? (
            <p className="w-full text-center h-60">Error loading leaderboard</p>
          ) : data?.leaderboard?.length === 0 ? (
            <p className="w-full text-center h-60">No user at this level</p>
          ) : (
            data?.leaderboard?.map((user: any, index: number) => (
              <div
                key={index}
                className="flex items-center bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none p-4 overflow-y-auto rounded-lg mt-2"
              >
                <div className="flex w-full">
                  <Image src={beeAvatar} alt={"beeavatar"} className="w-10 h-10 rounded-full mr-4" />
                  <div className="flex-1">
                    <p className="font-bold">{user.name ? user.name : "Honey Collector"}</p>
                    <p className="text-yellow-500 flex gap-4">
                      {user.points} <span className="text-white">{levelNames[currentIndex]}</span>
                    </p>
                  </div>
                </div>
                <div className="text-lg">{index + 1}</div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center mt-4">
        </div>
        <div>
          {
            levelNames[currentIndex] === user?.league && (
              <div className="fixed bottom-20 w-[90%] left-1/2 transform -translate-x-1/2 flex items-center bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none p-4 overflow-y-auto rounded-lg mt-2">
              <Image src={beeAvatar} alt={"user"} className="w-10 h-10 rounded-full mr-4" />
              <div className="flex-1">
                <p className="font-bold">{user?.name || "Honey Collector"}</p>
                <p className="text-yellow-500 flex gap-4">
                  {user?.points} <span className="text-white">{user?.league}</span>
                </p>
              </div>
              <div className="text-lg">{adjustedUserIndex}</div>
            </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
