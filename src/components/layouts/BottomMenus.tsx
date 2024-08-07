"use client";

import Coins from "../../../public/icons/Coins";
import Friends from "../../../public//icons/Friends";
import Mine from "../../../public/icons/Mine";
import { BeeCoin, Bees, binanceLogo,  } from "../../../public/newImages";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import useExchangeStore from "@/store/useExchangeStore";

type NavigationItem = {
  name: string;
  icon: JSX.Element;
  link: string;
};

const BottomNavigation = () => {
  const [activeLink, setActiveLink] = useState("/");

  const {exchange} = useExchangeStore();

  const NavigationItems: NavigationItem[] = [
    {
      name: "Exchange",
      icon: <Image src={exchange?.icon!} width={24} height={24} alt="Exchange"  className="object-contain w-full h-full" />,
      link: "/",
    },
    {
      name: "Mine",
      icon: <Mine className="w-6 h-6 mx-auto" />,
      link: "/tasks",
    },
    {
      name: "Friends",
      icon: <Friends className="w-6 h-6 mx-auto" />,
      link: "/referrals",
    },
    {
      name: "Earn",
      icon: <Coins className="w-6 h-6 mx-auto" />,
      link: "/market",
    },
    {
      name: "AirDrop",
      icon: <Image src={BeeCoin} width={24} height={24} alt="AirDrop" />,
      link: "/bonus",
    },
  ];

  const handleRoute = (link: string) => {
    setActiveLink(link);
    route.push(link);
  };

  const route = useRouter();
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0  p-1 h-fit left-1/2 transform -translate-x-1/2 w-full  max-w-xl bg-[#272a2f] flex justify-around items-center z-50  text-xs">
      {NavigationItems.map((item, index) => {
        return (
          <div
            key={index}
            className={`${
              pathname === item.link
                ? "bg-[#1c1f24] text-white"
                : "bg-[#272a2f]"
            } p-1.5 w-full flex items-center justify-center rounded-2xl `}
          >
            <button
              onClick={() => handleRoute(item.link)}
              className={`  text-center   flex items-center justify-center flex-col flex-wrap  text-[#85827d] `}
            >
              <div
                className={`${
                  pathname === item.link ? " text-white" : ""
                } mx-auto w-7 h-7`}
              >
                {item.icon}
              </div>
              <p
                className={` text-[10px] ${
                  pathname === item.link ? " text-white" : ""
                }  mt-1`}
              >
                {item.name}
              </p>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNavigation;