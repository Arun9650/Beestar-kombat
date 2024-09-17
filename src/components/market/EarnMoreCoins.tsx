"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  approved,
  Calendar,
  dollarCoin,
  Youtube,
} from "../../../public/newImages";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { formatNumber } from "../../../utils/formatNumber";
import { checkRewardStatus, claimReward } from "@/actions/bonus.actions";
import Link from "next/link";
import toast from "react-hot-toast";
import { completeTask, tasksList, TaskToShow } from "@/actions/tasks.actions";
import { Skeleton } from "../ui/skeleton";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";
import { useSearchParams } from "next/navigation";
import { useYouTubeMutation } from "@/hooks/mutation/useYouTube";
import { useFetchYoutubeTasks } from "@/hooks/query/useFetchYouTubeTask";
import { useFetchTasks } from "@/hooks/query/useFetchTask";
import { useTasksMutation } from "@/hooks/mutation/useTasksMutation";
import { ChevronRight } from "lucide-react";
import SectionBanner from "../sectionBanner";
import axios from "axios";

interface Reward {
  id?: string;
  userId?: string;
  day: number;
  coins: number;
  createdAt?: Date;
}

type Task = {
  id: string;
  name: string;
  points: number;
  category: string;
  icon: string;
  link: string;
  isUserTask: boolean;
};

const EarnMoreCoins = () => {
  const dailyRewards = useMemo(() => [
    { day: 1, reward: 500 },
    { day: 2, reward: 1000 },
    { day: 3, reward: 2500 },
    { day: 4, reward: 5000 },
    { day: 5, reward: 15000 },
    { day: 6, reward: 25000 },
    { day: 7, reward: 100000 },
    { day: 8, reward: 250000 },
    { day: 9, reward: 500000 },
    { day: 10, reward: 1000000 },
  ], []);

  const [isOpen, setIsOpen] = useState(false);
  const [isTelegramDrawerOpen, setIsTelegramDrawerOpen] = useState(false);

  const [rewards, setReward] = useState<Reward | null>(null);
  const [nextRewardAvailable, setNextRewardAvailable] = useState(false);
  // const [taskList, setTaskList] = useState<Task[]>();
  // const [isLoading, setIsLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);

  const {
    userId: user,
    increaseTapsLeft,
    currentTapsLeft,
    addPoints,
  } = usePointsStore();

  const { multiClickLevel } = useBoostersStore();

  const [buttonLoading, setButtonLoading] = useState(false);

  const YouTubeMutation = useYouTubeMutation();
  const TaskMutation = useTasksMutation();

  const search = useSearchParams();
  const id = search.get("id");

  const { data: YoutubeTask, isLoading: isYouTubeTaskLoading } =
    useFetchYoutubeTasks(id ?? userId ?? "");
  const { data: taskList, isLoading } = useFetchTasks(id ?? userId ?? "");

  console.log("🚀 ~ EarnMoreCoins ~ YoutubeTask:", YoutubeTask?.tasks);

  const [isYouTubeTaskProcessing, setIsYouTubeTaskProcessing] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      increaseTapsLeft();
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

  useEffect(() => {
    const userId = window.localStorage.getItem("authToken"); // Ensure userId is properly handled
    setUserId(userId);
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const checkReward = async () => {
      if (!userId) return;
      const data = await checkRewardStatus(userId, userTimezone);
      setNextRewardAvailable(data.nextRewardAvailable!);
      setReward(data.lastReward!);
    };

    checkReward();
  }, [userId]);

  const handleClaimReward = async () => {
    if (!userId) return;
    setButtonLoading(true);
    const loadingToastId = toast.loading("Claiming reward...");
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const data = await claimReward(userId, userTimezone);
    if (data.success && data.reward) {
      setNextRewardAvailable(false);
      setReward((prev) => ({
        day: (prev?.day || 0) + 1,
        coins: data.reward || 0,
      }));

      addPoints(data.reward);

      toast.success(`Reward claimed successfully! ${data.reward}`);
    } else {
      console.log(data.error);
      toast.error("Something went wrong!");
      toast.dismiss(loadingToastId);
      setButtonLoading(false);
    }

    toast.dismiss(loadingToastId);
    setButtonLoading(false);
  };

  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleTelegramTask = async (task: Task) => {
    if (!userId) return;
    setButtonLoading(true);
    
    try {
      const result = await axios.post("/api/telegramJoin", { userId:id || userId });
      if (result.data.status === "joined") {
        handleCompleteTask(task);
        setIsTelegramDrawerOpen(false);
      } else {
        toast.error("Please Join the Telegram Channel");
      }
    } catch (error) {
      toast.error("Error with Telegram task:");
    } finally {
      setButtonLoading(false);
    }
  };
  const handleCompleteTask = async (task: Task) => {
    if (!userId) return;

    if (userId && !isYouTubeTaskProcessing) {
      setIsYouTubeTaskProcessing(true);
      TaskMutation.mutate(
        { userId, taskId: task.id },
        {
          onSuccess: () => {
            toast.success("Task completed successfully!");
            addPoints(task.points);
            window.localStorage.setItem(
              "points",
              `${
                parseInt(window.localStorage.getItem("points") || "0") +
                task.points
              }`
            );
            setIsYouTubeTaskProcessing(false);
          },
        }
      );
    }
  };

  const handleCompleteYoutube = async (task: Task) => {
    if (userId && !isYouTubeTaskProcessing) {
      setIsYouTubeTaskProcessing(true);
      YouTubeMutation.mutate(
        { userId, taskId: task.id },
        {
          onSuccess: () => {
            toast.success("Task completed successfully!");
            addPoints(task.points);
            window.localStorage.setItem(
              "points",
              `${
                parseInt(window.localStorage.getItem("points") || "0") +
                task.points
              }`
            );
            setIsYouTubeTaskProcessing(false);
          },
        }
      );
    }
  };

  return (
    <>
      <SectionBanner
        mainText="Earn more coins"
        subText="Make our tasks to get more coins"
        leftIcon="/newImages/bee.png"
        rightIcon="/newImages/bee-right.png"
      />

      {/* youtube task start here */}
      <div className="space-y-4 mt-10 divide-y divide-custom-orange">
        <div>
          {isYouTubeTaskLoading && (
            <>
              {" "}
              <Skeleton className="w-full h-20" />
            </>
          )}
          {YoutubeTask?.tasks.map((task) => (
            <>
              <button
             
              
                className="flex items-center justify-between  w-full gap-2"
              >
                <Link href={task.link} target="_blank">
                  <div className="flex items-center">
                    <Image
                      src={task.icon}
                      alt="YouTube"
                      className="mr-4 border-2 border-white border-opacity-10 bg-white bg-opacity-10 p-2.5 rounded-xl "
                      width={50}
                      height={50}
                    />
                    <div className=" flex flex-col  justify-between py-1">
                      <p className="text-[#B7B5B5] text-[0.5rem] text-start">
                        5000 Points
                      </p>
                      <p className="font-normal text-start text-sm">
                        {task.name}
                      </p>
                      <p className="text-yellow-400  text-[0.5rem] flex items-center justify-start  gap-1 ">
                        Get reward <ChevronRight size={10} />{" "}
                      </p>
                    </div>
                  </div>
                </Link>

                {task.isUserTask ? (
                  <Button
                    className="bg-green-600 text-white font-semibold"
                   disabled
                  >
                    Redeem
                  </Button>
                ) : (
                  <Link href={task.link} target="_blank">
                  <Button     disabled={task.isUserTask || isYouTubeTaskProcessing}  onClick={() => {
                    
                    handleCompleteYoutube(task)
                  }
                } className="bg-green-600 text-white font-semibold">
                    Redeem
                  </Button>
                    </Link>
                )}
              </button>
            </>
          ))}
        </div>
{/* youtube task end here */}

        <div>
          {/* <h2 className="text-lg font-semibold mb-2">Daily tasks</h2> */}
          <div className="px-0 pt-2 flex items-center justify-between">
            <div className="w-full">
              <div
                className="flex items-center justify-between w-full "
                onClick={() => setIsOpen(true)}
              >
                <div className="flex w-full  items-center">
                  <Image
                    src={Calendar}
                    alt="Daily Reward"
                    className="mr-4 border-2 border-white border-opacity-10 bg-white bg-opacity-10 p-2.5 rounded-xl"
                    width={50}
                    height={50}
                  />
                  <span className="text-sm">
                    <div className=" flex flex-col  justify-between py-1">
                      <p className="text-[#B7B5B5] text-[0.5rem] text-start">
                        5000 Points
                      </p>
                      <p className="font-normal text-start text-xs">
                        Daily reward
                      </p>
                      <p className="text-yellow-400  text-[0.5rem] flex items-center justify-start  gap-1 ">
                        Get reward <ChevronRight size={10} />{" "}
                      </p>
                    </div>
                  </span>
                </div>
                <Button
                  onClick={() => setIsOpen(true)}
                  disabled={!nextRewardAvailable || buttonLoading}
                >
                  Redeem
                </Button>
              </div>
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
                          reward && (rewards?.day ?? 0) === day
                            ? "border border-green-600"
                            : (rewards?.day ?? 0) > day
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
                      disabled={!nextRewardAvailable || buttonLoading}
                      className="w-full p-7 my-4  text-white text-lg font-semibold rounded-xl "
                    >
                      {buttonLoading ? <div className="loader"></div> : "Claim"}
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>



        <div>
          {/* <h2 className="text-lg font-semibold mb-2">Tasks list</h2> */}
          {isLoading ? (
            // Skeleton loader
            <Skeleton className="w-full h-20" />
          ) : (
            taskList &&
            taskList.length > 0 &&
            taskList.map((task: Task, index) => (
              <div
                // disabled={task.isUserTask || isYouTubeTaskProcessing}
                // onClick={() => handleCompleteTask(task)}
                key={index}
                className="mt-2 flex items-center justify-between w-full"
              >
                <div className="flex items-center">
                  <Image
                    src={task.icon}
                    alt="Telegram"
                    className="mr-4 border-2 border-white border-opacity-10 bg-white bg-opacity-10 p-2.5 rounded-xl"
                    width={50}
                    height={50}
                  />
                  <Link href={task.link} target="_blank">
                    <div className=" flex flex-col  justify-between py-1">
                      <p className="text-[#B7B5B5] text-[0.5rem] text-start">
                        5000 Points
                      </p>
                      <p className="font-normal text-start text-sm">
                        {task.name}
                      </p>
                      <p className="text-yellow-400  text-[0.5rem] flex items-center justify-start  gap-1 ">
                        Get reward <ChevronRight size={10} />{" "}
                      </p>
                    </div>
                  </Link>
                </div>
                {task.isUserTask ? (
                  <Button
                    className="bg-green-600 text-white font-semibold"
                    disabled
                  >
                    Redeem
                  </Button>
                ) : (
                  <Button
                    className="bg-green-600 text-white font-semibold"
                    onClick={() => setIsTelegramDrawerOpen(true)}
                  >
                    Redeem
                  </Button>
                )}
                <Drawer open={isTelegramDrawerOpen}>
                  {/* <DrawerOverlay className=""  /> */}
                  <DrawerContent className="bg-[#14161a]  border-none px-2 ">
                    <DrawerHeader className="flex items-center justify-end  mt-4 ">
                      <div
                        onClick={() => setIsTelegramDrawerOpen(false)}
                        className="z-[100] absolute p-3 px-5 text-white bg-[#1C1F23] rounded-full"
                      >
                        x
                      </div>
                    </DrawerHeader>

                    <div className="text-center h-full flex flex-col">
                      <div>

                      <Image
                        src={task.icon}
                        alt="Daily Reward"
                        className="mx-auto w-12 h-12 mb-4"
                        width={40}
                        height={40}
                        />
                      <div className="flex justify-between items-center ">
                        <span className="  mx-auto text-white text-xl font-semibold">
                          Join our Telegram Channel
                        </span>
                      </div>
                        </div>
                      <Link
                        target="_blank"
                        href={task.link}
                        className="text-white text-xs bg-custom-orange  p-3  rounded-xl mt-4 max-w-64 mx-auto my-4"
                      >
                        Join
                      </Link>
                    </div>

                    <DrawerFooter className=" p-0">
                      <Button
                        onClick={() => handleTelegramTask(task)}
                        disabled={buttonLoading || isYouTubeTaskLoading}
                        className="w-full p-7 my-4  text-white text-lg font-semibold rounded-xl "
                      >
                        {buttonLoading ? (
                          <div className="loader"></div>
                        ) : (
                          "Check"
                        )}
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default EarnMoreCoins;
