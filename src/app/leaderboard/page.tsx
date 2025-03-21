"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useLeaderboard } from "@/hooks/query/useLeaderBoard";
import { usePointsStore } from "@/store/PointsStore";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { useUserStore } from "@/store/userUserStore";
import { beeAvatar } from "../../../public/newImages";
import SectionBanner from "@/components/sectionBanner";

const levelMinPoints = [
  0,          // Bronze
  5000,       // Silver
  25000,      // Gold
  100000,     // Platinum
  1000000,    // Diamond
  2000000,    // Epic
  10000000,   // Legendary
  50000000,   // Master
  100000000,  // GrandMaster
  1000000000, // Lord
  5000000000, // Champion
  10000000000,// Hero
  50000000000,// Titan
  100000000000,// Mythic
  500000000000,// Immortal
  1000000000000, // Eternal
  5000000000000  // Celestial
];

const levelNames = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Epic",
  "Legendary",
  "Master",
  "GrandMaster",
  "Lord",
  "Champion",
  "Hero",
  "Titan",
  "Mythic",
  "Immortal",
  "Eternal",
  "Celestial",
];


const Leaderboard = () => {
  const { user } = useUserStore();
  const { points } = usePointsStore();

  const initialLeagueIndex = useMemo(
    () => (user?.league ? levelNames.indexOf(user.league) : 0),
    [user?.league]
  );

  const [page, setPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(initialLeagueIndex);
  const [league, setLeague] = useState(levelNames[initialLeagueIndex]);


  const getNextLevelMinPoints = (currentIndex: number, levelMinPoints: number[]): number => {
    if (currentIndex + 1 >= levelMinPoints.length) {
      return levelMinPoints[levelMinPoints.length - 1];
    }
    return levelMinPoints[currentIndex + 1];
  };
  
  const nextLevelMinPoints = getNextLevelMinPoints(currentIndex, levelMinPoints);
  console.log("🚀 ~ Leaderboard ~ nextLevelMinPoints:", nextLevelMinPoints)


  const { data, isLoading, error } = useLeaderboard(league, page, 100,nextLevelMinPoints);
  console.log("🚀 ~ Leaderboard ~ data:", data)



const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    const result = (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    return result;
  }
  if (num >= 1_000_000) {
    const result = (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    return result;
  }
  if (num >= 1_000) {
    const result = (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return result;
  }
  const result = num.toString();
  return result;
};




  const calculateProgress = () => {
    if (user) {
      const leagueIndex = levelNames.findIndex((level) => level === user.league);
      const currentLevelMin = levelMinPoints[leagueIndex];
      const nextLevelMin = levelMinPoints[leagueIndex + 1];
      const progress = ((points) / nextLevelMin) * 100;

      return Math.min(Math.max(progress, 0), 100); // Ensures progress is between 0 and 100
    }
    return 0;
  };

  const handleArrowClick = (direction: "left" | "right") => {
    setPage(1); // Reset page to 1 on league change

    if (direction === "left" && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setLeague(levelNames[currentIndex - 1]);
    } else if (direction === "right" && currentIndex < levelNames.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setLeague(levelNames[currentIndex + 1]);
    }
  };

  const adjustedUserIndex = useMemo(() => {
    const userChatIdIndex = data?.leaderboard?.findIndex((level) => level.chatId === user?.chatId) ?? -1;
  
    // If user is found in the leaderboard, return the index + 1 (as index is 0-based)
    if (userChatIdIndex !== -1) {
      return userChatIdIndex + 1;
    }
  
    // If the user is not in the leaderboard, return a random number between 1001 and 9999
    return `${Math.floor(Math.random() * 9000) + 1001}+`;
  }, [data?.leaderboard, user?.chatId]);
  

  return (
    <div className="">
      <SectionBanner
      mainText="Leaderboard"
      subText="See who is doing well"
      leftIcon="/newImages/bee.png"
      rightIcon="/newImages/bee-right.png"
      />
      <div className="p-4 flex flex-col items-center">
        <div className="relative flex items-center gap-6">
          <SlArrowLeft
            onClick={() => handleArrowClick("left")}
            className={currentIndex === 0 ? "text-gray-500 font-bold cursor-not-allowed" : "font-bold cursor-pointer"}
            aria-label="Previous League"
            role="button"
          />
          <Image
            src={`/newImages/bee_avatars/${currentIndex + 1 }.png`}
            alt={levelNames[currentIndex]}
            className="w-32 h-32 mx-auto"
            width={200}
            height={200}
          />
          <SlArrowRight
            onClick={() => handleArrowClick("right")}
            className={currentIndex === levelNames.length - 1 ? "text-gray-500 font-bold cursor-not-allowed" : "font-bold cursor-pointer"}
            aria-label="Next League"
            role="button"
          />
        </div>
        <h1 className="text-4xl font-bold mt-4">{levelNames[currentIndex]}</h1>
        {levelNames[currentIndex] === user?.league ? (
          <p className="font-semibold text-[#95908a]">
            {formatNumber(points)} <span className="">/ 
              {formatNumber(nextLevelMinPoints)}
              </span>
          </p>
        ) : (
          <p className="font-semibold text-[#95908a]">from {" "}
          {formatNumber(levelMinPoints[currentIndex])}
          </p>
        )}
        {levelNames[currentIndex] === user?.league && (
          <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
            <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
          </div>
        )}
        <div className="mt-8 w-full pb-40 ">
          {isLoading ? (
            <div className="w-full text-center  flex items-center justify-center">
              <p>Loading...</p> {/* You could add a spinner here */}
            </div>
          ) : error ? (
            <div className="w-full text-center  flex items-center justify-center">
              <p>Error loading leaderboard</p>
            </div>
          ) : data?.leaderboard?.length === 0 ? (
            <div className="w-full text-center  flex items-center justify-center">
              <p>No users at this level</p>
            </div>
          ) : (
            data?.leaderboard?.map((user, index) => (
              <div
                key={index}
                className="flex items-center bg-[#252423] shadow-xl  p-4 overflow-y-auto rounded-lg mt-2"
              >
                <div className="flex w-full">
                  <Image src={beeAvatar} alt={"beeavatar"} className="w-10 h-10 rounded-full mr-4" />
                  <div className="flex-1">
                    <p className="font-bold">{user.name || "Honey Collector"}</p>
                    <p className="text-yellow-500 flex gap-4">
                      {formatNumber(user.points)} <span className="text-white">{levelNames[currentIndex]}</span>
                    </p>
                  </div>
                </div>
                <div className="text-lg">{index + 1}</div>
              </div>
            ))
          )}
        </div>
        {levelNames[currentIndex] === user?.league && (
          <div className="fixed bottom-32 w-[90%] left-1/2 transform -translate-x-1/2 flex items-center bg-[#252423] shadow-xl  p-4 overflow-y-auto rounded-lg mt-2">
            <Image src={beeAvatar} alt={"user"} className="w-10 h-10 rounded-full mr-4" />
            <div className="flex-1">
              <p className="font-bold">{user?.name || "Honey Collector"}</p>
              <p className="text-yellow-500 flex gap-4">
                {formatNumber(points)} <span className="text-white">{user?.league}</span>
              </p>
            </div>
            <div className="text-lg">{adjustedUserIndex}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
