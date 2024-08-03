"use client";

import { useState } from "react";
import { Progress } from "../ui/progress";
import Image from "next/image";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";

const GameLevelProgress = () => {
  const { points, currentTapsLeft, nextBenchmark } = usePointsStore();
  const { energyCapacity } = useBoostersStore();

  return (
    <>
      <div className="flex items-center my-4  gap-2 text-lg">
        <div>
          <Image
            src="/newImages/dollar-coin.png"
            height={35}
            width={35}
            alt=""
          />
        </div>
        <div>
          <span className="font-extrabold text-white text-xl">
            {currentTapsLeft}
          </span>
          /{energyCapacity}
        </div>
      </div>
    </>
  );
};

export default GameLevelProgress;
