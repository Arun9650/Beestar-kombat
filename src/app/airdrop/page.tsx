"use client";
import { usePointsStore } from "@/store/PointsStore";
import { BeeCoin, SponsorImage, tonWallet } from "../../../public/newImages";
import Image from "next/image";
import React, { useEffect } from "react";
import { useBoostersStore } from "@/store/useBoostrsStore";
import SectionBanner from "@/components/sectionBanner";
import CurrentPoints from "@/components/tasks/CurrentPoints";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from "@/components/ui/drawer";

interface TaskItemProps {
  iconSrc: string;
  title: string;
  buttonText: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ iconSrc, title, buttonText }) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  return (
    <>
    <div className="flex justify-between items-center p-2 rounded-lg border border-[#504949]">
      <div className="flex items-center gap-4">
        <Image src={iconSrc} alt={title} width={20} height={20} />
        <span className="text-white text-xs">{title}</span>
      </div>
      <Button onClick={() => setIsDrawerOpen(true)} className="text-xs">{buttonText}</Button>
    </div>
    <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          
            <DrawerContent className="bg-[#14161a] border-none ">
              <DrawerHeader
                onClick={() => setIsDrawerOpen(false)}
                className="flex text-white rounded-full justify-end  mr-0  w-full  items-center"
              >
                <div className="p-3 px-5 bg-[#252423] rounded-full">x</div>
              </DrawerHeader>
              <div className="text-center">
                {/* <Image
                  src={selectedSkin.image}
                  alt={selectedSkin.name}
                  width={100}
                  height={100}
                  className="mx-auto mb-4"
                /> */}
                <h2 className="text-2xl font-medium text-white mb-2">
                  {/* {selectedSkin.name} */}
                  Comming Soon
                </h2>
                {/* <p className="text-white">
                  {selectedSkin.league !== levelNames[levelIndex] && (
                    <span className="text-custom-orange">
                      You need to be at {selectedSkin.league}
                    </span>
                  )}
                </p>
                <p className="text-white">
                  <br />
                  <span className="text-white  flex max-w-fit mx-auto gap-2">
                    <Image src={dollarCoin} alt="coin" width={20} height={20} />
                    +{selectedSkin.cost}
                  </span>
                </p>
                    */}
              </div>

              <DrawerFooter>
                <Button
                  // disabled={
                  //   points < selectedSkin.cost ||
                  //   // selectedSkin.league !== levelNames[levelIndex]
                  //   !canBuySkin(selectedSkin, userInfo, levelNames)
                  // }
                  // onClick={() => handleBuySkin(userId!, selectedSkin)}
                  className="w-full py-8 bg-custom-orange text-zinc-700 text-xl rounded-lg hover:bg-yellow-700"
                >
                  { "Go head"}
                </Button>
              </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </>
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
