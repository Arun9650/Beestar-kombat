"use client";
import React from "react";
import TapGlobe from "./Globe";
import GameLevelProgress from "./EnergyMeter";
import PointsTracker from "./PointsTracker";
import Booster from "./Boost";

const HeroSection = () => {

  return (
    <div className="  flex flex-col justify-between  ">
      <div>
        <TapGlobe />
      </div>
      <Booster/>
      <div className="mx-auto my-2">
        <PointsTracker />
      </div>
      <div>
        <GameLevelProgress />
      </div>
    </div>
  );
};

export default HeroSection;
