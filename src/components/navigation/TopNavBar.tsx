"use client";
import React, { useEffect, useState } from "react";
import { beeAvatar } from "../../../public/newImages";
import Image from "next/image";
import { IoSettings } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { usePointsStore } from "@/store/PointsStore";
import useExchangeStore from "@/store/useExchangeStore";

const TopNavBar = () => {
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

  const router = useRouter();

  const userName = window.localStorage.getItem("userName");
  const { PPH, points } = usePointsStore();

  const { exchange } = useExchangeStore();
  const [levelIndex, setLevelIndex] = useState(6);

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress =
      ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
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


  return (
    <div className="w-full">
      <div className="flex justify-between p-2 bg-black bg-opacity-60 border border-yellow-500 backdrop-blur-lg rounded-xl m-2">
        <div className="flex gap-2 items-center  ">
          <Image
            src={beeAvatar}
            alt="avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>

          <p className="text-white capitalize text-sm font-medium ">
            {userName ? userName : "Anonymous"}
          </p>
          <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center w-full">
            <div onClick={() => router.push("leaderboard")} className="w-full ">
              <div className="flex items-baseline  justify-between">
                <p className="text-[8px]">{levelNames[levelIndex]}</p>
                <p className="text-[8px]">
                  {levelIndex + 1}{" "}
                  <span className="text-[#95908a]">/ {levelNames.length}</span>
                </p>
              </div>
              <div className="flex w-full items-center  border-2 border-[#43433b] rounded-full">
                <div className="w-full h-1 bg-[#43433b]/[0.6] rounded-full">
                  <div
                    className="progress-gradient h-1 rounded-full"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>

        </div>
        <div className="flex items-center justify-between gap-2 ">
            <div onClick={() => router.push('/skin')} className="flex items-center h-full  gap-2 text-white bg-orange-700 px-2 py-1 rounded-xl text-xs">
          <FaCartShopping className="w-4 h-4"  />
            <span>Buy Skin</span>
            </div>
          <IoSettings onClick={() => router.push("/settings")} className="w-8 h-8 text-white px-2 py-1 bg-zinc-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
