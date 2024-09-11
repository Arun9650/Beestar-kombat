"use client";
import Image from "next/image";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";

const GameLevelProgress = () => {
  const { currentTapsLeft } = usePointsStore();
  const { energyCapacity } = useBoostersStore();

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center  xs:my-4  gap-2 text-lg">
        <div>
          <Image src="/newImages/Energy.png" height={14} width={14} alt="" />
        </div>
        <div className=" text-white text-xl">
          <span>{currentTapsLeft}</span>/{energyCapacity}
        </div>
      </div>
    </div>
  );
};

export default GameLevelProgress;
