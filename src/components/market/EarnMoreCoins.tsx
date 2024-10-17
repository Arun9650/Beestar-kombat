"use client";

import React, { useState, useEffect } from "react";
import SectionBanner from "../sectionBanner";
import DailyRewards from "@/components/market/DailyRewards";
import TaskList from "@/components/market/TaskList";
import YouTubeTasks from "@/components/market/YouTubeTasks";
import BuyCoinAnimation from "../coinanimation/BuyCoinAnimation";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";
import { useSearchParams } from "next/navigation";

const EarnMoreCoins = () => {
  const [isTelegramDrawerOpen, setIsTelegramDrawerOpen] = useState(false);
  const { increaseTapsLeft,currentTapsLeft } = usePointsStore();
  const { multiClickLevel } = useBoostersStore();
  const search = useSearchParams();
  const id = search.get("id");
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    const intervalId = setInterval(() => {
      increaseTapsLeft();
      const local = parseInt(
        window.localStorage.getItem("currentTapsLeft") ?? "0"
      );
      if (local < currentTapsLeft && !isNaN(currentTapsLeft)) {
        window.localStorage.setItem(
          "currentTapsLeft",
          (currentTapsLeft + multiClickLevel).toString()
        );
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const userId = window.localStorage.getItem("authToken");
    setUserId(userId || id || '');
  }, []);

  return (
    <>
      <BuyCoinAnimation />
      <SectionBanner
        mainText="Earn more coins"
        subText="Make our tasks to get more coins"
        leftIcon="/newImages/bee.png"
        rightIcon="/newImages/bee-right.png"
      />
      <YouTubeTasks userId={userId!}  />
      <DailyRewards userId={userId!} />
      <TaskList userId={userId!}  />
    </>
  );
};

export default EarnMoreCoins;
