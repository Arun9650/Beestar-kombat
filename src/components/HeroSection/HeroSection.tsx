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

const HeroSection = () => {

  const {PPH} = usePointsStore();
 
  return (
    <div className="flex flex-col justify-between">
      
        <MenuGrid/>
        <div className="flex justify-between items-center my-2 text-[0.5rem]">
        <Button className="text-[0.5rem] px-3 py-4 h-5 ">
       Profit per hour: {PPH}
        </Button>
         <Button className='flex items-center gap-2 text-[0.5rem] px-3 py-4 h-5'> 
        <Image src="/newImages/tap.png" alt="" width={20} height={20} className="" /> 
            
        Earn per tab: 1</Button>
      
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
