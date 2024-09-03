"use client";

import { useState } from "react";
import { Progress } from "../ui/progress";
import Image from "next/image";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";
import { useRouter, useSearchParams } from "next/navigation";

const GameLevelProgress = () => {
  const { points, currentTapsLeft, nextBenchmark } = usePointsStore();
  // console.log("🚀 ~ currentTapsLeft:", currentTapsLeft)
  const { energyCapacity } = useBoostersStore();
  // console.log("🚀 ~ energyCapacity:", energyCapacity)

  const router = useRouter();
  const search = useSearchParams();
  const id = search.get("id");


  const handleRoute = () => {
    router.push(`/booster?id=${id}`);
  };

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

      <button onClick={() => handleRoute() } className="text-2xl  flex items-center">
        <Image src="/newImages/rocket.png" alt="" width={50} height={50} className="rotate-12" />
        <p className="text-sm text-white font-bold">Boost</p>
      </button>
    </div>
  );
};

export default GameLevelProgress;
