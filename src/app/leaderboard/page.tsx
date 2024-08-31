"use client";
// pages/leaderboard.js
import React, { use, useEffect, useState } from "react";
import { beeAvatar, MainBee } from "../../../public/newImages";
import Image from "next/image";
import { getLeaderboard } from "@/actions/user.actions";
import { usePointsStore } from "@/store/PointsStore";

import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";
import { useBoostersStore } from "@/store/useBoostrsStore";
import { useUserStore } from "@/store/userUserStore";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<
    | {
        points: number;
        name: string | null;
        chatId: string;
        league: string | null;
      }[]
    | []
  >([]);

  const [levelIndex, setLevelIndex] = useState(6);
  const { points, PPH } = usePointsStore();
  const [userName, setUserName] = useState("Honey Collector");

  const [userInfo, setUserInfo] = useState<any>({});

  const { user } = useUserStore();

  const [currentIndex, setCurrentIndex] = useState(0);

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

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    if (user) {
      const leagueIndex = levelNames.findIndex(
        (level) => level === user?.league
      );
      const currentLevelMin = levelMinPoints[leagueIndex];
      const nextLevelMin = levelMinPoints[leagueIndex + 1];
      const progress =
        ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;

      const clampedProgress = Math.max(Math.min(progress, 100), 0);
      return clampedProgress;
    }
    return 0;
  };

  const { currentTapsLeft, increaseTapsLeft } = usePointsStore();
  const { multiClickLevel } = useBoostersStore();

  useEffect(() => {
    const intervalId = setInterval(() => {
      increaseTapsLeft();
      let time = Date.now();
      window.localStorage.setItem("lastLoginTime", time.toString());
      const local = parseInt(
        window.localStorage.getItem("currentTapsLeft") ?? "0"
      );

      if (local < currentTapsLeft && !isNaN(currentTapsLeft)) {
        window.localStorage.setItem(
          "currentTapsLeft",
          (currentTapsLeft + multiClickLevel).toString()
        );
      }
    }, 1000); // Adjust interval as needed

    return () => clearInterval(intervalId);
  }, [currentTapsLeft]);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(calculateProgress());
  }, [calculateProgress, points, user]);

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
      console.log("🚀 ~ fetchLeaderboard ~ response:", response);

      if (response.leaderboard) {
        setLeaderboardData(response.leaderboard);
        const user = response.leaderboard.find((user) => {
          return user.chatId === userName;
        });

        if (user) {
          setUserInfo(user);
        }
      }
    };
    fetchLeaderboard();
  }, []);
  const filterUsersByLevel = () => {
    const currentLeague = levelNames[currentIndex];
    return leaderboardData.filter((user) => user.league === currentLeague);
  };

  const handleArrowClick = (direction: "left" | "right") => {
    if (direction === "left" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "right" && currentIndex < levelNames.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getImageSrc = () => {
    return `/newImages/bee_avatars/${currentIndex + 1}.png`;
  };

  const filteredUsers = filterUsersByLevel();

  return (
    <div className="min-h-screen bg-black bg-opacity-60 backdrop-blur-none rounded-t-3xl top-glow border-t-4 border-[#f3ba2f]  from-purple-800 to-black text-white">
      <div className="p-4 flex flex-col items-center">
        <div className="relative flex items-center gap-6">
          <SlArrowLeft
            onClick={() => handleArrowClick("left")}
            className={
              currentIndex === 0 ? "text-gray-500 font-bold" : "font-bold"
            }
          />
          <Image
            src={getImageSrc()}
            alt={getImageSrc()}
            className="w-32 h-32 mx-auto"
            width={200}
            height={200}
          />
          <SlArrowRight
            onClick={() => handleArrowClick("right")}
            className={
              currentIndex === levelNames.length - 1
                ? "text-gray-500 font-bold"
                : "font-bold"
            }
          />
        </div>
        <h1 className="text-4xl font-bold mt-4">{levelNames[currentIndex]}</h1>
        {levelNames[currentIndex] === user?.league ? (
          <p className="font-semibold text-[#95908a]">
            { (formatNumber(points) )  }{" "}
            <span className="">/ {formatNumber(levelMinPoints[currentIndex])}</span>
          </p>
        ) : <p className="font-semibold text-[#95908a]">from  {formatNumber(levelMinPoints[currentIndex])}</p>}
        {levelNames[currentIndex] === user?.league && (
          <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
            <div
              className="progress-gradient h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <div className="mt-8 w-full pb-40">
          {filteredUsers.length === 0 ? (
            <p className="w-full text-center h-60">No user at this level</p>
          ) : (
            filteredUsers.map((user, index) => (
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
                  <p className="text-yellow-500 flex gap-4">
                    {user.points}{" "}
                    <span className="text-white">
                      {levelNames[currentIndex]}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div>
          <div className=" fixed bottom-20   w-[90%] left-1/2 transform -translate-x-1/2 flex items-center bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none p-4 overflow-y-auto rounded-lg mt-2">
            <Image
              src={beeAvatar}
              alt={"user"}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-1">
              <p className="font-bold">
                {userName ? userName : "honey Collector"}
              </p>
              <p className="text-yellow-500 flex gap-4">
                {userInfo.points}{" "}
                <span className="text-white">
                  {user ? user.league : levelNames[currentIndex]}
                </span>{" "}
              </p>
            </div>
            <div className="text-lg">{userInfo.points}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
