"use client";
// pages/boosters.js
import React, { useState } from "react";
import {
  dollarCoin,
  honeycomb,
  recharge,
  rocket,
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


interface Booster {
  name: string;
  status?: string
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
    refill, decreaseRefill,
  } = useBoostersStore();
  const { points, reducePoints , currentTapsLeft, increaseTapsLeft } = usePointsStore();

  const freeBoosters = [
    {
      name: "Full energy",
      status:  refill.toString(),
      icon: honeycomb,
      discription:
        "reachage your energy to the maximum and do another round of mining.",
    },
    { name: "Turbo", status: "Coming soon", icon: rocket },
  ];

  const boosters = [
    {
      name: "Energy limit",
      cost: energyCapacity * 2,
      level: energyCapacity / 500,
      icon: recharge,
      discription: "Increase the amount of energy",
    },
  ];

  const handleEnergyCapacityIncrease = () => {
    if (energyCapacity * 2 <= points) {
      reducePoints(energyCapacity * 2);
      setEnergyCapacity(energyCapacity + 500);
      window.localStorage.setItem("BoostersEnergy", (energyCapacity + 500).toString());
      toast.success("Energy Capacity increased to " + energyCapacity  + 500);
    } else {
      toast.error("Not enough points");
    }
  };


  const handleFuelRefill = () => {
    if (refill > 0) {
        const tapsToAdd = energyCapacity - currentTapsLeft
        console.log(energyCapacity)

        increaseTapsLeft(tapsToAdd)
        decreaseRefill()

        toast.success("Taps refilled" + energyCapacity)
    }
}


const handleBoosterSelection = (boosterName:string) => {
  switch (boosterName) {
    case "Full energy":
      handleFuelRefill();
      break;
    case "Energy limit":
      handleEnergyCapacityIncrease();
      break;
    default:
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
            <p className="text-3xl font-bold">{points.toString()}</p>
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
                <p className="text-gray-400">{booster.status}/6 available</p>
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
                </div>

                <p className="text-white mx-auto text-sm max-w-[80%] text-center">
                  {selectedBooster.discription}
                </p>

                {selectedBooster.name === "Energy limit" && (
                  <p className="text-white mx-auto">
                    +500 energy points for level {selectedBooster.level}
                  </p>
                )}

                <div className="flex items-center justify-center gap-4 text-white">
                  <div className="flex items-center gap-2">
                    <Image src={dollarCoin} alt="coin" width={30} height={30} />
                    {selectedBooster.name === "Energy limit"
                      ? energyCapacity * 2
                      : "Free"}
                  </div>
                  <div className="flex gap-4">
                    {selectedBooster.name === "Energy limit" && (
                      <div>lvl {selectedBooster.level}</div>
                    )}
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <Button
                  // disabled={points < selectedSkin.cost}
                  onClick={() => handleBoosterSelection(selectedBooster.name)}
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
