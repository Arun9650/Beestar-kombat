'use client'
import GameLevelProgress from "@/components/game/GameLevelProgress";
import TapGlobe from "@/components/game/Globe";
import Header from "@/components/Header";
import CurrentPoints from "@/components/tasks/CurrentPoints";
import TaskList from "@/components/tasks/TaskList";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React, { Suspense } from "react";
import { dollarCoin } from "../../../public/newImages";
import { formatNumber } from "../../../utils/formatNumber";
import Info from "../../../public/icons/Info";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";

const TasksPage =  () => {
  const { PPH } = usePointsStore();
  const { multiClickLevel } = useBoostersStore();


  return (
    <section className="relative top-glow border-t-4 pt-4  border-[#f3ba2f]  bg-black bg-opacity-60 backdrop-blur-none rounded-t-3xl flex flex-grow  items-center    flex-col overflow-auto ">
    <div className="grid grid-cols-2 divide-x w-full rounded-full px-4 py-[2px]">
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
      <CurrentPoints />
      <Header />
      <TaskList />
    </section>
  );
};

export default TasksPage;
