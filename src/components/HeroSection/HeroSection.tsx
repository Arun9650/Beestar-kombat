"use client";
import React from "react";
import TapGlobe from "./Globe";
import GameLevelProgress from "./EnergyMeter";
import PointsTracker from "./PointsTracker";
import Booster from "./Boost";
import { formatNumberWithCommas } from "../../../utils/formatNumber";
import MenuGrid from "./MenuGrid";
import { usePointsStore } from "@/store/PointsStore";

const HeroSection = () => {

  const {PPH} = usePointsStore();
 
  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-between items-center my-2 text-[0.6rem]">
        <div>
       Profit per hour: {PPH}
        </div>
        Earn per tab: 1
      </div>
        <PointsTracker formatNumber={formatNumberWithCommas} />
        <MenuGrid/>
        <TapGlobe />
        <div className="flex items-center justify-between">
      <Booster/>
        <GameLevelProgress />
        </div>
    </div>
  );
};

export default HeroSection;
