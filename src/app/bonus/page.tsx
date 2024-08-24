'use client';
import { usePointsStore } from "@/store/PointsStore";
import { BeeCoin, SponsorImage, tonWallet } from "../../../public/newImages";
import Image from "next/image";
import React, { useEffect } from "react";
import { useBoostersStore } from "@/store/useBoostrsStore";

const AirDrop = () => {
  
  const {currentTapsLeft, increaseTapsLeft} = usePointsStore()
  const {multiClickLevel} = useBoostersStore()
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
    <div className="p-4 flex-grow bg-black bg-opacity-60 backdrop-blur-none rounded-t-3xl top-glow border-t-4 border-[#f3ba2f]   max-w-xl mx-auto text-white ">
      <div className="flex flex-col items-center mb-6">
        <div className="glowing-coin my-4">
            <Image src={SponsorImage} alt="TON Wallet" width={150} height={150} />
        </div>
        <h1 className="text-2xl font-bold mt-4">Airdrop tasks</h1>
        <p className="text-center mt-2">
          Listing is on its way. Tasks will appear below. Complete them to
          participate in the Airdrop
        </p>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Tasks list</h2>
        <div className="bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={tonWallet}
              alt="TON Wallet"
              width={48}
              height={48}
              className="mr-4"
            />
            <p className="font-semibold">Connect your TON wallet</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AirDrop;
