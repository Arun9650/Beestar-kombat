"use client";
// pages/boosters.js
import React, { useEffect, useState } from "react";
import {
  Click,
  dollarCoin,
  honeycomb,
  recharge,
  rocket,
  Tab,
} from "../../../public/newImages";
import Image, { StaticImageData } from "next/image";
import { usePointsStore } from "@/store/PointsStore";
import { SlArrowRight } from "react-icons/sl";
import { useBoostersStore } from "@/store/useBoostrsStore";
import toast from "react-hot-toast";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  creditEnergy,
  creditMultiClickLevel,
  getUserEnergy,
} from "@/actions/bonus.actions";
import { formatNumberWithCommas } from "../../../utils/formatNumber";
import { updatePointsInDB } from "@/actions/points.actions";
import { getUserConfig } from "@/actions/user.actions";

interface Booster {
  id:number;
  name: string;
  status?: string;
  icon: StaticImageData;
  discription?: string;
  cost?: number;
  level?: number;
}

const Boosters = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedBooster, setSelectedBooster] = useState<Booster>();

  const {
    multiClickLevel,
    energyCapacity,
    rechargeVelocity,
    setRechargeVelocity,
    setMultiClickLevel,
    setEnergyCapacity,
    setMultiClickCost,
    refill,
    setRefill,
    decreaseRefill,
    multiClickCost,
  } = useBoostersStore();
  const { points, reducePoints, currentTapsLeft, increaseTapsLeft } =
    usePointsStore();

  const freeBoosters = [
    {
      id: 1,
      name: "Full energy",
      status: refill.toString(),
      icon: honeycomb,
      discription:
        "Reacharge your energy to the maximum and do another round of mining.",
    },
    { id:4, name: "Turbo", status: "Coming soon", icon: rocket },
  ];

  const boosters = [
    {
      id: 2,
      name: "Energy limit",
      cost: energyCapacity * 2,
      level: energyCapacity / 500,
      icon: recharge,
      discription: "Increase the amount of energy",
    },
    {
      id: 3,
      name: "Multi Tap",
      cost: multiClickCost * 2,
      level: multiClickCost / 500,
      icon: Click,
      discription: "Increase the Earn Per Tab",
    },
  ];

  const handleEnergyCapacityIncrease = async () => {
    const userId = window.localStorage.getItem("authToken");
    if (energyCapacity * 2 <= points) {
      setButtonLoading(true);
      toast
        .promise(
          (async () => {
            // Update points in the database
            await updatePointsInDB({
              points: points,
              id: userId!,
            });

            reducePoints(energyCapacity * 2);
            const newEnergyCapacity = energyCapacity + 500;
            setEnergyCapacity(newEnergyCapacity);

            const result = await creditEnergy(userId!, energyCapacity * 2);
            if (!result.success) {
              throw new Error(result.message || "Credit failed");
            }

            window.localStorage.setItem(
              "points",
              (points).toString()
            );
            window.localStorage.setItem(
              "energyCapacity",
              newEnergyCapacity.toString()
            );
            setIsDrawerOpen(false);

            return `Energy Capacity credited ${500}`;
          })(),
          {
            loading: "Crediting energy...",
            success: (data) => data,
            error: "something went wrong...",
          }
        )
        .finally(() => {
          setButtonLoading(false);
        });
    } else {
      toast.error("Not enough points");
    }
  };

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

  const handleFuelRefill = () => {
    if (refill > 0) {
      const tapsToAdd = energyCapacity - currentTapsLeft;
      increaseTapsLeft(tapsToAdd);
      decreaseRefill();
      const newRefillValue = refill - 1;
      setRefill(newRefillValue);
      window.localStorage.setItem("refill", newRefillValue.toString());
      // window.localStorage.setItem("currentTapsLeft", (currentTapsLeft + tapsToAdd).toString());
      setIsDrawerOpen(false);
      toast.success("Taps refilled " + energyCapacity);
    }
  };

  const handleMultiTapIncrease = async () => {
    const userId = window.localStorage.getItem("authToken");
    if (multiClickCost * 2 <= points) {
      await updatePointsInDB({ points: points, id: userId! });

      reducePoints(multiClickCost * 2);
      const newMultiClickCost = multiClickCost + 500;
      setMultiClickCost(newMultiClickCost);
      const newMultiClickLevel = multiClickLevel + 1;
      setMultiClickLevel(newMultiClickLevel);

      const result = await creditMultiClickLevel(userId!, multiClickCost * 2);
      if (result.success) {
        window.localStorage.setItem(
          "points",
          (points - multiClickCost * 2).toString()
        );
        window.localStorage.setItem(
          "multiClickCost",
          newMultiClickCost.toString()
        );
        window.localStorage.setItem(
          "multiClickLevel",
          newMultiClickLevel.toString()
        );
        setIsDrawerOpen(false);
        toast.success("Multiplier increased to " + newMultiClickLevel);
      }
    } else {
      toast.error("Not enough points");
    }
  };

  const handleBoosterSelection = (id: number) => {
    if (id === 1) {
      handleFuelRefill();
    } else if (id === 2) {
      handleEnergyCapacityIncrease();
    } else if (id === 3) {
      handleMultiTapIncrease();
    } else {
      toast.error("Booster not recognized or not available");
    }
  };

  const handleBoosterClick = (booster: Booster) => {
    setSelectedBooster(booster);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen  bg-black bg-opacity-60 backdrop-blur-none rounded-t-3xl top-glow border-t-4 border-[#f3ba2f] text-white">
      <div className="p-4">
        <div className="text-center mb-8">
          <p className="text-gray-400">Your balance</p>
          <div className="flex justify-center items-center">
            <Image src={dollarCoin} alt="Coin" className="w-6 h-6 mr-2" />
            <p className="text-3xl font-bold">
              {formatNumberWithCommas(points)}
            </p>
          </div>
          <p className="text-yellow-500 mt-2">How a boost works</p>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">Free daily boosters</h2>
          {freeBoosters.map((booster) => (
            <div
              key={booster.name}
              onClick={() => handleBoosterClick(booster)}
              className="flex items-center bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none  p-2 rounded-2xl mb-2"
            >
              <Image
                src={booster.icon}
                alt={booster.name}
                width={50}
                height={50}
                className="w-8 h-8 mr-4"
              />
              <div className="flex-1">
                <p className="font-bold">{booster.name}</p>
                <p className="text-gray-400">
                  {booster.status}
                  {booster.name === "Full energy" && "/6 available"}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">Boosters</h2>
          {boosters.map((booster) => (
            <div
              key={booster.name}
              onClick={() => handleBoosterClick(booster)}
              className="flex items-center bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none   p-2 rounded-2xl mb-2"
            >
              <Image
                src={booster.icon}
                alt={booster.name}
                width={50}
                height={50}
                className="w-8 h-8 mr-4"
              />
              <div className="flex-1">
                <p className="font-bold">{booster.name}</p>
                <div className="flex items-center text-gray-400">
                  <Image
                    src={dollarCoin}
                    alt="Coin"
                    width={50}
                    height={50}
                    className="w-4 h-4 mr-1"
                  />
                  <span>{booster.cost}</span>
                  <span className="ml-2">lvl {booster.level}</span>
                </div>
              </div>
              <span className="text-gray-400">
                <SlArrowRight className="text-gray-400" />
              </span>
            </div>
          ))}
        </div>

        {selectedBooster && (
          <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            <DrawerContent className="bg-[#14161a] border-none">
              <DrawerHeader
                onClick={() => setIsDrawerOpen(false)}
                className="flex pb-0  text-white rounded-full justify-end mr-0 w-full items-center"
              >
                <div className="p-3 px-5 bg-[#1C1F23] rounded-full">x</div>
              </DrawerHeader>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-center">
                  <Image
                    src={selectedBooster?.icon}
                    alt={selectedBooster?.name}
                    width={100}
                    height={100}
                    className="mx-auto mb-4"
                  />
                  <h2 className="text-2xl font-medium text-white mb-2">
                    {selectedBooster?.name}
                  </h2>
                  <p className="text-gray-400">
                    {selectedBooster?.discription}
                  </p>
                </div>
                {selectedBooster?.name === "Full energy" && (
                  <p className="text-sm text-yellow-500">
                    You will recharge full energy points for level{" "}
                    {selectedBooster.level}
                  </p>
                )}

                <div className="flex items-center justify-center gap-4 text-white">
                  <div className="flex items-center gap-2">
                    <Image src={dollarCoin} alt="coin" width={30} height={30} />
                    {selectedBooster.name === "Energy limit"
                      ? energyCapacity * 2
                      : selectedBooster.name === "Multi Tap"
                      ? multiClickCost * 2
                      : "Free"}
                  </div>
                  <div className="flex gap-4">
                    {selectedBooster.name === "Energy limit" ? (
                      <div>lvl {selectedBooster.level}</div>
                    ) : selectedBooster.name === "Multi Tap" ? (
                      <div>lvl {selectedBooster.level}</div>
                    ) : null}
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <Button
                  onClick={() => handleBoosterSelection(selectedBooster.id)}
                  className="w-full py-8 bg-yellow-400 text-zinc-700 text-xl rounded-lg hover:bg-yellow-700"
                >
                  {buttonLoading ? <div className="loader"></div> : "Go ahead"}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
};

export default Boosters;
