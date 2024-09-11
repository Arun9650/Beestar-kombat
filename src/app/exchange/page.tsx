"use client";

// pages/exchange.js
import React, { useEffect, useState } from "react";
import { SlArrowRight } from "react-icons/sl";

import Image, { StaticImageData } from "next/image";
import useExchangeStore, { TExchange } from "@/store/useExchangeStore";
import { FaCheck } from "react-icons/fa";
import { useBoostersStore } from "@/store/useBoostrsStore";
import { usePointsStore } from "@/store/PointsStore";
import SectionBanner from "@/components/sectionBanner";

const Exchange = () => {
  const { exchange, setExchange, exchanges } = useExchangeStore();
  const handleSelect = (exchange: TExchange) => {
    setExchange(exchange);
    window.localStorage.setItem("exchange", exchange.name);
  };

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
    <div className="text-white">
      <SectionBanner
      mainText="Select Exchange"
      subText="Change settings according to yourself"
      leftIcon="/newImages/bee.png"
      rightIcon="/newImages/bee-right.png"
      />
  <div className="grid grid-cols-3 gap-2">
        {exchanges.map((item) => (
          <div
            onClick={() => handleSelect(item)}
            className={`my-1 flex items-center justify-between border rounded-md p-2 ${
              item.name === exchange.name
                ? "border-custom-orange"
                : "border-[#504949]"
            }`}
            key={item.name}
          >
             <div className="flex items-center gap-2 justify-between">
             <Image
              src={item.icon}
              alt={`${item.name} icon`}
              width={24}
              height={24}
            />
              <label
                htmlFor={`radio-${item.name}`}
                className="flex items-center cursor-pointer text-[0.5rem] text-gray-400 peer-checked:text-white peer-focus:text-white"
              >
                {item.name}
              </label>
            </div>
            <span
              className={`h-3 w-3 flex justify-center items-center border border-gray-400 rounded-full transition-colors duration-300 ease-in-out ${
                item.name === exchange.name
                  ? "bg-custom-orange border-custom-orange"
                  : " "
              }`}
            >
              {item.name === exchange.name && (
                <span className="block w-1.5 h-1.5 bg-white rounded-full"></span>
              )}
            </span>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exchange;
