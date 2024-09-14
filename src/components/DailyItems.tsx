"use client";
import React, { useEffect, useState } from "react";
import {
  binanceLogo,
  dailyCipher,
  dailyCombo,
  dailyReward,
  dollarCoin,
} from "../../public/newImages";
import Image from "next/image";
import useExchangeStore from "@/store/useExchangeStore";
import Link from "next/link";
import { usePointsStore } from "@/store/PointsStore";
import Info from "../../public/icons/Info";
import { useRouter } from "next/navigation";
import { useBoostersStore } from "@/store/useBoostrsStore";
import { formatNumber } from "../../utils/formatNumber";

const DailyItems = () => {
  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const route = useRouter();
  const { exchange, setExchange, exchanges } = useExchangeStore();
  const { multiClickLevel } = useBoostersStore();

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
    const exchangeName = window.localStorage.getItem("exchange");

    const getExchange = exchanges.find(
      (exchange) => exchange.name === exchangeName
    );

    if (getExchange !== undefined) {
      setExchange(getExchange!);
    }

    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const { PPH } = usePointsStore();

  return (
    <div className="w-full  z-0">
      <div className="flex-grow mt-2 relative  border-t-4 border-[#f3ba2f] rounded-t-[48px]  top-glow -z-1">
        <div className=" pb-0  rounded-t-[46px]">
          <div className="px-4 mt-6 flex justify-between gap-2">
            <div className="grid grid-cols-2 divide-x w-full   rounded-full px-4 py-[2px] ">
              <div className="flex items-center  flex-col">
                <p className="text-[10px]">Earn per tap</p>
                <div className="flex gap-2 items-center">
                  <Image
                    src={dollarCoin}
                    alt="Dollar Coin"
                    className="w-[18px] h-[18px]"
                  />
                  +{multiClickLevel}
                </div>
              </div>

              <div className="text-center ">
                <p className="text-[10px] text-[#85827d] font-medium">
                  Profit per hour
                </p>
                <div className="flex items-center justify-center space-x-1">
                  <Image
                    src={dollarCoin}
                    alt="Dollar Coin"
                    className="w-[18px] h-[18px]"
                  />
                  <p className="text-sm">{formatNumber(PPH)}</p>
                  <Info size={16} className="text-[#43433b]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyItems;
