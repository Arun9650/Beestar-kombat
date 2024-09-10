"use client";
import React from "react";
import TapGlobe from "./Globe";
import GameLevelProgress from "./EnergyMeter";
import PointsTracker from "./PointsTracker";
import Booster from "./Boost";
import { formatNumberWithCommas } from "../../../utils/formatNumber";
import MenuGrid from "./MenuGrid";

const HeroSection = () => {

  return (
    <div className="flex flex-col justify-between">
        <MenuGrid/>
        <TapGlobe />
      <Booster/>
      <div className="flex xs:block">
        <PointsTracker formatNumber={formatNumberWithCommas} />
        <GameLevelProgress />
      </div>
    </div>
  );
};

export default HeroSection;
