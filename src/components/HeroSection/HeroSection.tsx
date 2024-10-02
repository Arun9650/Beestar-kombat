"use client";
import React from "react";
import TapGlobe from "./Globe";
import GameLevelProgress from "./EnergyMeter";
import PointsTracker from "./PointsTracker";
import Booster from "./Boost";
import { formatNumberWithCommas } from "../../../utils/formatNumber";
import MenuGrid from "./MenuGrid";
import { usePointsStore } from "@/store/PointsStore";
import { Button } from "../ui/button";
import Image from "next/image";
import { useBoostersStore } from "@/store/useBoostrsStore";
// import eruda from 'eruda'
const HeroSection = () => {
  // eruda.init()
  const {PPH} = usePointsStore();
 
  const {multiClickLevel} = useBoostersStore()
  return (
    <div className="flex flex-col justify-between">
      
        <MenuGrid/>
        <div className="flex justify-between items-center my-2 text-[0.5rem]">
        <div className="text-[0.6rem] p-2   bg-[#252423] rounded-md">
       Profit per hour: {PPH}
        </div>
         <div className='flex items-center gap-2 text-[0.6rem] p-2 bg-[#252423] rounded-md'> 
        <Image src="/newImages/tap.png" alt="" width={20} height={20} className="" /> 
            
        Earn per tab: {multiClickLevel}</div>
      
      </div>
      <div className="flex items-center justify-center  my-2">
        <PointsTracker formatNumber={formatNumberWithCommas} />
      </div>
        <TapGlobe />
        <div className="flex items-center justify-between">
      <Booster/>
        <GameLevelProgress />
        </div>
    </div>
  );
};

export default HeroSection;
