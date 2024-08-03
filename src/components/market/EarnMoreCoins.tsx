"use client";


import React, { useState } from "react";
import {
  approved,
  BeeCoin,
  Calendar,
  dollarCoin,
  exchange,
  invite,
  Telegram,
  X,
  Youtube,
} from "../../../public/newImages";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { formatNumber } from "../../../utils/formatNumber";

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

const EarnMoreCoins = () => {
  const dailyRewards = [
    { day: 1, reward: 500 },
    { day: 2, reward: 1000 },
    { day: 3, reward: 2500 },
    { day: 4, reward: 5000 },
    { day: 5, reward: 15000 },
    { day: 6, reward: 25000 },
    { day: 7, reward: 100000 },
    { day: 8, reward: 500000 },
    { day: 9, reward: 1000000 },
    { day: 10, reward: 5000000 },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const [currentDay, setCurrentDay] = useState(1);

  const [goal, setGoal] = React.useState(350);

  const handleClaim = () => {
    // Handle claim logic here
    alert(`Claimed ${dailyRewards[currentDay - 1].reward} coins!`);
  };

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  return (
    <div className="p-4 bg-black text-white max-w-xl mx-auto shadow-lg">
        <div className="flex flex-col items-center mb-6">
        <div className="glowing-coin my-8">
            <Image src={dollarCoin} alt="TON Wallet" width={150} height={150} />
        </div>
       
      </div>
      <div className="flex flex-col items-center mb-4 ">
        
        <h1 className="text-2xl font-bold">Earn more coins</h1>
      </div>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Beestar Youtube</h2>
          <div className="p-4 bg-[#1d2025] rounded-2xl flex items-center justify-between">
            <div className="flex items-center">
              <Image src={Youtube} alt="YouTube" className="w-12 h-12 mr-4" />
              <div>
                <p className="font-semibold">5 richest people in the world</p>
                <p className="text-yellow-400">+100,000</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Daily tasks</h2>
          <div className="p-4 bg-[#1d2025] rounded-2xl flex items-center justify-between">
            <div>
              <p className="flex items-center " onClick={() => setIsOpen(true)}>
                <Image
                  src={Calendar}
                  alt="Daily Reward"
                  className="w-12 h-12 mr-4"
                />
                <span className="">
                  Daily reward:{" "}
                  <span className="text-yellow-400 flex items-center justify-between  gap-2">
                    {/* <image src={Coins} alt="approved icon" className="w-12 h-12" /> */}
                    <Image src={dollarCoin} alt="Coin" className="w-4 h-4 " />
                    +6,649,000{" "}
                  </span>
                </span>
              </p>
              <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
                {/* <DrawerOverlay /> */}
                <DrawerContent className="bg-[#1d2025] border-none px-2">
                  {/* <DrawerHeader className="p-0">
            
          </DrawerHeader> */}

                  <div className="text-center ">
                    <Image
                      src={Calendar}
                      alt="Daily Reward"
                      className="mx-auto w-12 h-12 mb-4"
                    />
                    <div className="flex justify-between items-center">
                      <span className="  mx-auto text-white text-xl font-semibold">
                        Daily reward
                      </span>
                      {/* <IconButton onClick={() => setIsOpen(false)} icon={<XIcon />} /> */}
                    </div>
                    {/* <h2 className="text-2xl text-white mb-2 border border-black">Daily reward</h2> */}
                    <p className="text-white text-xs max-w-64 mx-auto my-4">
                      Accrue coins for logging into the game daily without
                      skipping
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {dailyRewards.map((reward, index) => (
                      <div
                        key={index}
                        className={`px-2 py-2 flex flex-col items-center justify-center gap-1 rounded-lg text-center ${
                          currentDay >= reward.day
                            ? "bg-green-600"
                            : "bg-[#222429]"
                        }`}
                      >
                        <p className="text-xs text-white">Day {reward.day}</p>
                        <Image src={dollarCoin} alt="Coin" className="w-5 h-5"  />
                        <p className="text-xs font-semibold  text-white">
                          {formatNumber(reward.reward)}{" "}
                          {/* <span className="text-xs">coins</span> */}
                        </p>
                      </div>
                    ))}
                  </div>

                  <DrawerFooter className=" p-0">
                    <Button
                      onClick={handleClaim}
                      className="w-full p-7 my-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700"
                    >
                      Claim
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Tasks list</h2>
          <div className="p-4 bg-[#1d2025] rounded-2xl flex items-center justify-between">
            <div className="flex items-center">
              <Image src={Telegram} alt="Telegram" className="w-12 h-12 mr-6" />
              <div>
                <p className="font-semibold">Join our TG channel</p>
                <p className="text-yellow-400">+5,000</p>
              </div>
            </div>
            <Image src={approved} alt="approved icon" className="w-12 h-12" />
          </div>
          <div className="p-4 bg-[#1d2025] rounded-2xl mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <Image src={X} alt="Telegram" className="w-12  h-12 mr-4" />
              <div>
                <p className="font-semibold">Follow our X account</p>
                <p className="text-yellow-400">+5,000</p>
              </div>
            </div>
            <Image src={approved} alt="approved icon" className="w-12 h-12" />
          </div>
          <div className="p-4 bg-[#1d2025] rounded-2xl mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <Image src={exchange} alt="Telegram" className="w-12 h-12 mr-6" />
              <div>
                <p className="font-semibold">Choose your exchange</p>
                <p className="text-yellow-400">+5,000</p>
              </div>
            </div>
            <Image src={approved} alt="approved icon" className="w-12 h-12" />
          </div>
          <div className="p-4 bg-[#1d2025] rounded-2xl mt-2 mb-16 flex items-center justify-between">
            <div className="flex items-center">
              <Image src={invite} alt="Telegram" className="w-12 h-12 mr-4" />
              <div>
                <p className="font-semibold">Invite 3 Friends</p>
                <p className="text-yellow-400">+5,000</p>
              </div>
            </div>
            <Image src={approved} alt="approved icon" className="w-12 h-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnMoreCoins;
