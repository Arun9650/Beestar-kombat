'use client'
import CurrentPoints from "@/components/tasks/CurrentPoints";
import TaskList from "@/components/tasks/TaskList";
import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
import { dollarCoin } from "../../../public/newImages";
import { formatNumber } from "../../../utils/formatNumber";
import Info from "../../../public/icons/Info";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";
import SectionBanner from "@/components/sectionBanner";
import useAnimationStore from "@/store/useAnimationStore";
import BuyCoinAnimation from "@/components/coinanimation/BuyCoinAnimation";

const TasksPage =  () => {
  const { PPH, currentTapsLeft, increaseTapsLeft } = usePointsStore();
  const { multiClickLevel } = useBoostersStore();

  const {purchaseCompleteAnimation} =  useAnimationStore();

  const [userId, setUserId] = useState('');


  useEffect(() => {
    const userId = window.localStorage.getItem("userId");
    if(userId){
      setUserId(userId);
    }
  },[])

  useEffect(() => {
    const intervalId = setInterval(() => {
    
        increaseTapsLeft();
        let time = Date.now();
        window.localStorage.setItem("lastLoginTime", time.toString() );
        const local = parseInt(
          window.localStorage.getItem("currentTapsLeft") ?? "0"
        );

        if (local < currentTapsLeft && !isNaN(currentTapsLeft)) {
          window.localStorage.setItem(
            "currentTapsLeft",
            (currentTapsLeft + multiClickLevel).toString()
          );
        }
      
    }, 1000); // Adjust interval as needed

    return () => clearInterval(intervalId);
  }, [ currentTapsLeft]);


  return (
    <div className="flex items-center flex-col w-full">
    <>
      <SectionBanner
        mainText="Do Mine"
        subText="Make our tasks to get more coins"
        leftIcon="/newImages/bee.png"
        rightIcon="/newImages/bee-right.png"
        />
      <CurrentPoints />
      <TaskList userId={userId} />
        </>
      <BuyCoinAnimation />
    </div>
  );
};

export default TasksPage;
