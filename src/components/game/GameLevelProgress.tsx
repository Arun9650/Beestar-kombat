"use client";

import { useState } from "react";
import { Progress } from "../ui/progress";
import Image from "next/image";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";
import { useRouter } from "next/navigation";

const GameLevelProgress = () => {
  const { points, currentTapsLeft, nextBenchmark } = usePointsStore();
  const { energyCapacity } = useBoostersStore();

  const router = useRouter();

  return (
    <div className="flex items-center justify-between w-full px-4">
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

      <div onClick={() => {router.push("booster")}} className="text-2xl  rotate-12">
        <Image src="/newImages/rocket.png" alt="" width={50} height={50} />
      </div>
    </div>
  );
};

export default GameLevelProgress;
