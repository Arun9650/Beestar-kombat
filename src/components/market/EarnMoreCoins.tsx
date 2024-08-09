"use client";

import React, { useEffect, useState } from "react";
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
  DrawerHeader,
  DrawerOverlay,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { formatNumber } from "../../../utils/formatNumber";
import { checkRewardStatus, claimReward } from "@/actions/bonus.actions";
import Link from "next/link";
import toast from "react-hot-toast";

interface Reward {
  id?: string;
  userId?: string;
  day: number;
  coins: number;
  createdAt?: Date;
}

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

  const taskList = [
    {
      id: 1,
      title: "Join our TG channel",
      reward: 5000,
      link: "https://t.me/+2jJ-IidSHKo0OWJl",
      icon: Telegram,
    },
    {
      id: 2,
      title: "Follow Us On X channel",
      reward: 10000,
      link: "https://x.com",
      icon: X,
    },
    {
      id: 3,
      title: "choose your exchange",
      reward: 10000,
      link: "/exchange",

      icon: exchange,
    },
    {
      id: 4,
      title: "Invite 3 friends",
      reward: 10000,
      link: "",
      icon: invite,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const [rewards, setReward] = useState<Reward | null>(null);
  const [nextRewardAvailable, setNextRewardAvailable] = useState(false);

  const userId = window.localStorage.getItem("authToken"); // Ensure userId is properly handled

  useEffect(() => {
    const checkReward = async () => {
      if (!userId) return;
      const data = await checkRewardStatus(userId);
      setNextRewardAvailable(data.nextRewardAvailable!);
      setReward(data.lastReward!);
    };

    checkReward();
  }, [userId]);

  const handleClaimReward = async () => {
    if (!userId) return;
    const data = await claimReward(userId);
    if (data.success && data.reward) {
      setNextRewardAvailable(false);
      setReward((prev) => ({
        day: (prev?.day || 0) + 1,
        coins: data.reward || 0,
      }));
      toast.success(`Reward claimed successfully! ${data.reward} `);
    } else {
      console.log(data.error);
    }
  };

  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    const storedCompletedTasks = JSON.parse(
      window.localStorage.getItem("completedTasks") || "[]"
    );
    setCompletedTasks(storedCompletedTasks);
  }, []);

  const handleCompleteTask = (taskId: string) => {
    const newCompletedTasks = [...completedTasks, taskId];
    setCompletedTasks(newCompletedTasks);
    window.localStorage.setItem(
      "completedTasks",
      JSON.stringify(newCompletedTasks)
    );
  };

  return (
    <div className="p-4 bg-black flex-grow  bg-opacity-60 backdrop-blur-none rounded-t-3xl top-glow border-t-4 border-[#f3ba2f]  text-white max-w-xl pb-20 mx-auto shadow-lg">
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
          <div className="p-4 bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none rounded-2xl flex items-center justify-between">
            <div className="flex items-center">
              <Image src={Youtube} alt="YouTube" className="w-12 h-12 mr-4" />
              <div>
                <p className="font-semibold">5 richest people in the world</p>
                <p className="text-yellow-400  flex items-center justify-start gap-1">
                  <Image src={dollarCoin} alt="Coin" className="w-4 h-4 " />
                  +100,000
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Daily tasks</h2>
          <div className="p-4 bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none rounded-2xl flex items-center justify-between">
            <div>
              <p className="flex items-center " onClick={() => setIsOpen(true)}>
                <Image
                  src={Calendar}
                  alt="Daily Reward"
                  className="w-12 h-12 mr-4"
                />
                <span className="">
                  Daily reward:{" "}
                  <span className="text-yellow-400 flex items-center justify-between  gap-1">
                    <Image src={dollarCoin} alt="Coin" className="w-4 h-4 " />
                    +6,649,000{" "}
                  </span>
                </span>
              </p>
              <Drawer open={isOpen}>
                {/* <DrawerOverlay className=""  /> */}
                <DrawerContent className="bg-[#14161a]  border-none px-2 ">
                  <DrawerHeader className="flex items-center justify-end  mt-4 ">
                    <div
                      onClick={() => setIsOpen(false)}
                      className="z-[100] absolute p-3 px-5 text-white bg-[#1C1F23] rounded-full"
                    >
                      x
                    </div>
                  </DrawerHeader>

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
                    </div>
                    <p className="text-white text-xs max-w-64 mx-auto my-4">
                      Accrue coins for logging into the game daily without
                      skipping
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {dailyRewards.map(({ day, reward }) => (
                      <div
                        key={day}
                        className={`px-2 py-2 flex flex-col items-center justify-center gap-1 rounded-lg text-center ${
                          reward && (rewards?.day ?? 0) >= day
                            ? "bg-green-600"
                            : "bg-[#222429]"
                        }`}
                      >
                        <p className="text-xs text-white">Day {day}</p>
                        <Image
                          src={dollarCoin}
                          alt="Coin"
                          className="w-5 h-5"
                        />
                        <p className="text-xs font-semibold  text-white">
                          {formatNumber(reward)}{" "}
                        </p>
                      </div>
                    ))}
                  </div>

                  <DrawerFooter className=" p-0">
                    <Button
                      onClick={handleClaimReward}
                      disabled={!nextRewardAvailable}
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
          {taskList.map((task, index) => (
            <div
              onClick={() => handleCompleteTask(task.id.toString())}
              key={index}
              className="p-4 bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none rounded-2xl mt-2 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Image
                  src={task.icon}
                  alt="Telegram"
                  className="w-12 h-12 mr-6"
                />
                <Link href={task.link}>
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-yellow-400  flex items-center justify-start gap-1">
                    <Image src={dollarCoin} alt="Coin" className="w-4 h-4 " />
                    +5,000
                  </p>
                </Link>
              </div>
              {completedTasks.includes(task.id.toString()) && (
                <Image
                  src={approved}
                  alt="approved icon"
                  className="w-12 h-12"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarnMoreCoins;
