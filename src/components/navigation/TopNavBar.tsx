"use client";
import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import { beeAvatar } from "../../../public/newImages";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { usePointsStore } from "@/store/PointsStore";
import useExchangeStore from "@/store/useExchangeStore";
import { useUserStore } from "@/store/userUserStore";
import { getUserConfig } from "@/actions/user.actions";
import { setTimeout } from "timers";
import { Button } from "../ui/button";
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";


const TopNavBar = () => {



  const [isUserLevelUp, SetIsUserLevelUp] = useState(false);
  const [isUserPremium, setIsUserPremium] = useState<boolean | undefined>(false);
  const [prevLevelIndex, setPrevLevelIndex] = useState<number | null>(null); 


  const pathname = usePathname();


  const levelNames = useMemo(
    () => [
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
    ],
    []
  );

  const levelMinPoints = useMemo(
    () => [
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
    ],
    []
  );

  const userName = window.localStorage.getItem("userName");
  const { PPH, points } = usePointsStore();

  const { exchange } = useExchangeStore();
  const [levelIndex, setLevelIndex] = useState(0);


  const { user, setUser } = useUserStore();

  const [progess, setProgress] = useState(0);

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
      const progress = (points / nextLevelMin) * 100;

      const clampedProgress = Math.max(Math.min(progress, 100), 0);
      return clampedProgress;
    }
    return 0;
  }, [levelIndex, levelMinPoints, levelNames, points, user]);

  useEffect(() => {
    setProgress(calculateProgress());
  }, [points, calculateProgress]);

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
      let userInfoFromDB;
      if (!user) {
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
        setPrevLevelIndex(levelIndex);
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

  useEffect(() => {
    if (prevLevelIndex !== null && levelIndex > prevLevelIndex) {
      SetIsUserLevelUp(true);
    }
  }, [levelIndex, prevLevelIndex, levelNames]);
  
  const route = useRouter();

  const search = useSearchParams();

  const id = search.get("id");

  const handleRoute = (link: string) => {
    const linkWithId = id ? `${link}?id=${id}` : link;
    route.push(linkWithId);
  };

  const leagueIndex = levelNames.findIndex((level) => level === user?.league);
 

  useEffect(() => {
    function initTg() {
      if (typeof window !== 'undefined') {
       

        if(user){
          const { initDataRaw, initData } = retrieveLaunchParams();
          const isPremium = initData?.user?.isPremium;
          setIsUserPremium(isPremium);
        }

  } else {
    console.log('Telegram WebApp is undefined, retrying…');
    setTimeout(initTg, 500);
    }
    }
    initTg();
  }, []);

  return (
    <div className="w-full">
      {
         <AlertDialog  open={isUserLevelUp} onOpenChange={SetIsUserLevelUp}>
         <AlertDialogContent className="bg-white/90 max-w-80">
           <AlertDialogHeader>
             <AlertDialogTitle>🎉 Congratulations!</AlertDialogTitle>
             <AlertDialogDescription>
             You unlocked the {levelNames[levelIndex]} level!
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter className="flex flex-row  justify-end">
             {/* <AlertDialogCancel className="bg-transparent">Cancel</AlertDialogCancel> */}
             <Button
             className="border w-fit"
               onClick={() => {
                SetIsUserLevelUp(false);
               }}
             >
               Continue
             </Button>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
      }
      <div className="flex justify-between p-2 bg-[#252423]  rounded-xl  mb-2 xs:m-2 ">
        <div className="flex gap-2 items-center  ">
          <Image
            src={beeAvatar}
            alt="avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <p className="text-white capitalize text-sm font-medium min-w-16 truncate max-w-40 flex items-center gap-1">
              {userName ? userName : "Anonymous"} 
              {
              isUserPremium &&  <Image src="/newImages/approved.png" width={16} height={16} alt="approved" />
              }
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

        <Button onClick={() => handleRoute("/skin")} className=" flex items-center gap-2 text-sm">
          Skin
        </Button>
      </div>
    </div>
  );
};

export default TopNavBar;
