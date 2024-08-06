"use client";
import React, { useEffect, useState } from "react";
import { dailyCipher, dailyCombo, dailyReward } from "../../public/newImages";
import Image from "next/image";

const DailyItems = () => {
  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full z-0">
      <div className="flex-grow mt-2 border-t-4 border-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
        <div className=" pb-0 bg-[#1d2025] rounded-t-[46px]">
          <div className="px-4 mt-6 flex justify-between gap-2">
            <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
              <div className="dot"></div>
              <Image
                src={dailyReward}
                alt="Daily Reward"
                className="mx-auto w-12 h-12"
              />
              <p className="text-[10px] text-center text-white mt-1">
                Daily reward
              </p>
              <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                {dailyRewardTimeLeft}
              </p>
            </div>
            <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
              <div className="dot"></div>
              <Image
                src={dailyCombo}
                alt="Daily Combo"
                className="mx-auto w-12 h-12"
              />
              <p className="text-[10px] text-center text-white mt-1">
                Daily combo
              </p>
              <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                {dailyComboTimeLeft}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyItems;
