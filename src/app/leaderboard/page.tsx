"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useLeaderboard } from "@/hooks/query/useLeaderBoard";
import { usePointsStore } from "@/store/PointsStore";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { useUserStore } from "@/store/userUserStore";
import { beeAvatar } from "../../../public/newImages";
import SectionBanner from "@/components/sectionBanner";

const levelMinPoints = [0, 5000, 25000, 100000, 1000000, 2000000, 10000000, 50000000, 100000000, 1000000000];
const levelNames = [
  "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Epic", "Legendary", "Master", "GrandMaster", "Lord",
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

  const { data, isLoading, error } = useLeaderboard(league, page);

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
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
    const userLeagueIndex = data?.leaderboard?.findIndex((level) => level.league === user?.league) ?? -1;
    const userChatIdIndex = data?.leaderboard?.findIndex((level) => level.chatId === user?.chatId) ?? -1;
    return userLeagueIndex === -1 ? `${Math.floor(Math.random() * 9000) + 1001}+` : userChatIdIndex + 1;
  }, [data?.leaderboard, user?.league, user?.chatId]);

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
            {formatNumber(points)} <span className="">/ {formatNumber(levelMinPoints[currentIndex + 1])}</span>
          </p>
        ) : (
          <p className="font-semibold text-[#95908a]">from {formatNumber(levelMinPoints[currentIndex])}</p>
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
