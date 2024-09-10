"use client";
import { usePointsStore } from "@/store/PointsStore";
import { BeeCoin, SponsorImage, tonWallet } from "../../../public/newImages";
import Image from "next/image";
import React, { useEffect } from "react";
import { useBoostersStore } from "@/store/useBoostrsStore";
import SectionBanner from "@/components/sectionBanner";
import CurrentPoints from "@/components/tasks/CurrentPoints";
import { Button } from "@/components/ui/button";
import Flag from "react-flagpack";

interface TaskItemProps {
  iconSrc: string;
  title: string;
  buttonText: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ iconSrc, title, buttonText }) => {
  return (
    <div className="flex justify-between items-center p-2 rounded-lg border border-[#504949]">
      <div className="flex items-center gap-4">
        <Image src={iconSrc} alt={title} width={20} height={20} />
        <span className="text-white text-xs">{title}</span>
      </div>
      <Button className="text-xs">{buttonText}</Button>
    </div>
  );
};

const AirDrop = () => {
  const tasks = [
    {
      iconSrc: "/icons/passive-income.png",
      title: "Passive Income",
      buttonText: "Get Airdrop",
    },
    {
      iconSrc: "/icons/earn-task.png",
      title: "Earn Task",
      buttonText: "Get Airdrop",
    },
    {
      iconSrc: "/icons/friends.png",
      title: "Friends",
      buttonText: "Get Airdrop",
    },
    {
      iconSrc: "/icons/achivements.png",
      title: "Achievement",
      buttonText: "Get Airdrop",
    },
    {
      iconSrc: "/icons/telegram.png",
      title: "Telegram Subscription",
      buttonText: "Get Airdrop",
    },
    { iconSrc: "/icons/key.png", title: "Keys", buttonText: "Get Airdrop" },
  ];

  const { currentTapsLeft, increaseTapsLeft } = usePointsStore();
  const { multiClickLevel } = useBoostersStore();
  useEffect(() => {
    const intervalId = setInterval(() => {
      increaseTapsLeft();
      let time = Date.now();
      window.localStorage.setItem("lastLoginTime", time.toString());
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
  }, [currentTapsLeft]);

  return (
    <div className="w-full mx-auto text-white ">
      <SectionBanner
        mainText="Get Airdrop"
        subText="Make our tasks to get more coins"
        leftIcon="/newImages/bee.png"
        rightIcon="/newImages/bee-right.png"
      />
      <CurrentPoints />
      <div className="flex flex-col gap-2 mt-3">
        {tasks.map((task, index) => (
          <TaskItem
            key={index}
            iconSrc={task.iconSrc}
            title={task.title}
            buttonText={task.buttonText}
          />
        ))}
      </div>
    </div>
  );
};

export default AirDrop;
