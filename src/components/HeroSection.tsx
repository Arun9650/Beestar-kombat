"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { dollarCoin } from "../../public/newImages";
import { formatNumber } from "../../utils/formatNumber";
import Info from "../../public/icons/Info";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";
import CurrentPoints from "./tasks/CurrentPoints";
import TapGlobe from "./game/Globe";
import GameLevelProgress from "./game/GameLevelProgress";
import PointsTracker from "./game/PointsTracker";
import { getUserEnergy } from "@/actions/bonus.actions";

const HeroSection = () => {
  const { PPH } = usePointsStore();
  const { multiClickLevel,setEnergyCapacity } = useBoostersStore();


  useEffect(() => {
    let userId;
    if (typeof window !== 'undefined') {
    
     userId = window.localStorage.getItem("authToken");
    }
      // const boostersEnergy = window.localStorage.getItem("BoostersEnergy");
      const fetchEnergy = async () => {
        const boostersEnergy = await getUserEnergy(userId!);
        console.log("🚀 ~ fetchEnergy ~ boostersEnergy:", boostersEnergy)
        if ( boostersEnergy) {
          if(boostersEnergy.energy > 0){
            setEnergyCapacity((boostersEnergy.energy));
          }
        }
      }
      
    fetchEnergy();
  },[]) 

  return (
    <div className="bg-black h-full flex-grow pb-20  bg-opacity-60 backdrop-blur-none rounded-t-3xl top-glow border-t-4 border-[#f3ba2f] flex flex-col justify-between  overflow-hidden">
    <div className="grid grid-cols-2 divide-x w-full pt-4  rounded-full px-4 py-[2px]">
      <div className="flex flex-col items-center">
        <p className="text-[10px] text-white">Earn per tap</p>
        <div className="flex gap-2 items-center">
          <Image
            src={dollarCoin}
            alt="Dollar Coin"
            className="w-[18px] h-[18px]"
          />
          +{multiClickLevel}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-[10px] text-white font-medium">Profit per hour</p>
        <div className="flex items-center justify-center space-x-1">
          <Image
            src={dollarCoin}
            alt="Dollar Coin"
            className="w-[18px] h-[18px]"
          />
          <p className="text-sm">{formatNumber(PPH)}</p>
          <Info size={16} className="text-white" />
        </div>
      </div>
    </div>
    <div className="mx-auto my-2">
      <PointsTracker />
    </div>
    <div>
      <TapGlobe />
    </div>
    <div>
      <GameLevelProgress />
    </div>
  </div>
  
  );
};

export default HeroSection;
