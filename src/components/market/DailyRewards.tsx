import React, { useState, useEffect, useMemo } from "react";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { checkRewardStatus, claimReward } from "@/actions/bonus.actions";
import { usePointsStore } from "@/store/PointsStore";
import Image from "next/image";
import { dollarCoin, Calendar } from "../../../public/newImages";
import { formatNumber } from "../../../utils/formatNumber";
import toast from "react-hot-toast";
import useAnimationStore from "@/store/useAnimationStore";
import { ChevronRight } from "lucide-react";

interface Reward {
  day: number;
  coins: number;
}

interface Props {
  userId: string | null;
}

const DailyRewards: React.FC<Props> = ({ userId }) => {
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
  const [rewards, setReward] = useState<Reward | null>(null);
  const [nextRewardAvailable, setNextRewardAvailable] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { addPoints } = usePointsStore();
  const {setPurchaseCompleteAnimation} = useAnimationStore();

  useEffect(() => {
    if (userId) {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const checkReward = async () => {
        const data = await checkRewardStatus(userId, userTimezone);
        setNextRewardAvailable(data.nextRewardAvailable!);
        setReward(data.lastReward!);
      };
      checkReward();
    }
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
      setPurchaseCompleteAnimation(true)
    } else {
      toast.error("Something went wrong!");
    }
    setButtonLoading(false);
  };

  return (
    <>
      <div className="px-0 flex items-center justify-between">
        <div className="w-full">
          <div
            className="flex items-center justify-between w-full"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center">
              <Image
                src={Calendar}
                alt="Daily Reward"
                width={50}
                height={50}
                className="mr-4 border-2 border-white/10 bg-white/10 p-2.5 rounded-xl"
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
            <Button onClick={() => setIsOpen(true)} disabled={!nextRewardAvailable || buttonLoading}>
              Redeem
            </Button>
          </div>

          <Drawer open={isOpen}>
            <DrawerContent className="bg-[#14161a] border-none px-2">
              <DrawerHeader className="flex items-center justify-end mt-4">
                <div onClick={() => setIsOpen(false)} className="absolute p-3 px-5 text-white bg-[#1C1F23] rounded-full">x</div>
              </DrawerHeader>
              <div className="text-center">
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
                      {buttonLoading ? <div className="loader"></div> : (nextRewardAvailable ? "Claim" : "Come back tomorrow")}
                    </Button>
                  </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>
  );
};

export default DailyRewards;
