"use client";
import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import { beeAvatar } from "../../../public/newImages";
import Image from "next/image";
import { IoSettings } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { usePointsStore } from "@/store/PointsStore";
import useExchangeStore from "@/store/useExchangeStore";
import { useUserStore } from "@/store/userUserStore";
import { getUserConfig } from "@/actions/user.actions";
import { setTimeout } from "timers";

const TopNavBar = () => {
  const levelNames = useMemo(
    () => [
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
    ],
    []
  );

  const levelMinPoints = useMemo(
    () => [
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
    ],
    []
  );

  const userName = window.localStorage.getItem("userName");
  const { PPH, points } = usePointsStore();

  const { exchange } = useExchangeStore();
  const [levelIndex, setLevelIndex] = useState(0);

  interface User {
    league: string;
    // Add other properties as needed
  }

  const { user, setUser } = useUserStore();

  const [progess , setProgress] = useState(0)

  const calculateProgress = useCallback(() => {
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
  },[levelIndex, levelMinPoints, levelNames, points, user]);


  useEffect(() => {
    setProgress(calculateProgress());
  },[points, calculateProgress])


  const updateLevelInDB = async (newLevel: string) => {
    console.log("🚀 ~ updateLevelInDB ~ newLevel:", newLevel);
    const userId = window.localStorage.getItem("authToken");
    if (!userId) return;

    try {
      const data = await fetch("/api/updateLevel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, newLevel }),
      });

      if (!data.ok) {
        throw new Error("Failed to update level in DB");
      }
      const response = await data.json();
      console.log("🚀 ~ updateLevelInDB ~ response:", response);
      return response;
    } catch (error) {
      console.error("Failed to update level in DB:", error);
    }
  };



  useEffect(() => {
    const update = async () => {

      const userId = window.localStorage.getItem("authToken");
      let userInfo = user;
      let userInfoFromDB 
      if(!user){
        
               userInfoFromDB = await getUserConfig(userId!);
               userInfo = userInfoFromDB?.userDetails;
      }
  
      // Retry mechanism if userInfo is null
      const maxRetries = 3;
      let retries = 0;
  
      while (!userInfo && retries < maxRetries) {
        // console.log(`Retrying to fetch user info... Attempt ${retries + 1}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
        userInfoFromDB = await getUserConfig(userId!);
        userInfo = userInfoFromDB?.userDetails;
        retries++;
      }
      
      // console.log("🚀 ~ update ~ userInfo:", userInfo);
      const leagueIndex = levelNames.findIndex(
        (level) => level === userInfo?.league
      );
      if (leagueIndex !== -1) {
        setLevelIndex(leagueIndex);
      }
      // console.log("🚀 ~ update ~ leagueIndex:", leagueIndex);
      const currentLevelMin = levelMinPoints[leagueIndex];
      // console.log("🚀 ~ update ~ currentLevelMin:", currentLevelMin);
      const nextLevelMin = levelMinPoints[leagueIndex + 1];
      // console.log("🚀 ~ update ~ nextLevelMin:", nextLevelMin);
      // console.log(points);
      if (points >= nextLevelMin && leagueIndex < levelNames.length - 1) {
        // console.log("running...");
        setLevelIndex(leagueIndex + 1);
        const res = await updateLevelInDB(levelNames[leagueIndex + 1]);
        // console.log("🚀 ~ update ~ res:", res);
        if (res && res.user && res.user.league && user) {
          setUser({ ...user, league: res.user.league });
        }
      } else if (points < currentLevelMin && leagueIndex > 0) {
        setLevelIndex(leagueIndex);
      }
    };
    const retryUpdate = () => {
      if (typeof window !== "undefined") {
        update();
      } else {
        setTimeout(retryUpdate, 10); // Retry after 1 second
      }
    };
  
    retryUpdate();
  }, [points]);

  const route = useRouter();

  const search = useSearchParams();

  const id = search.get("id");

  const handleRoute = (link: string) => {
    const linkWithId = id ? `${link}?id=${id}` : link;
    route.push(linkWithId);
  };

  const leagueIndex = levelNames.findIndex(
    (level) => level === user?.league
  );

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
            <p className="text-white capitalize text-sm font-medium min-w-16   truncate max-w-40 ">
              {userName ? userName : "Anonymous"} 
            </p>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center w-full">
                <div
                  onClick={() => handleRoute("leaderboard")}
                  className="w-full "
                >
                  <div className="flex items-baseline  justify-between">
                    <p className="text-[8px] ">
                      {user ? user.league : levelNames[levelIndex]}
                    </p>
                    <p className="text-[8px]">
                      { user ? leagueIndex + 1 :  levelIndex + 1}{" "}
                      <span className="text-[#95908a]">
                        / {levelNames.length}
                      </span>
                    </p>
                  </div>
                  <div className="flex w-full items-center  border-2 border-[#43433b] rounded-full">
                    <div className="w-full h-1 bg-[#43433b]/[0.6] rounded-full">
                      <div
                        className="progress-gradient h-1 rounded-full"
                        style={{ width: `${progess}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 ">
          <div
            onClick={() => handleRoute("/skin")}
            className="flex items-center h-full  gap-2 text-white bg-orange-700 px-2 py-1 rounded-xl text-xs"
          >
            <FaCartShopping className="w-4 h-4" />
            <span>Buy Skin</span>
          </div>
          <IoSettings
            onClick={() => handleRoute("/settings")}
            className="w-8 h-8 text-white px-2 py-1 bg-zinc-700 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;