"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Mine from "../../../public/icons/Mine";
import Friends from "../../../public/icons/Friends";
import Image from "next/image";
import Coins from "../../../public/icons/Coins";
import { BeeCoin } from "../../../public/newImages";
import useExchangeStore from "@/store/useExchangeStore";

const BottomNavigation = () => {
  const { exchange } = useExchangeStore();

  const NavigationItems = [
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
      name: "Exchange",
      icon: (
        <Image
          src={exchange?.icon!}
          width={24}
          height={24}
          alt="Exchange"
          className="object-contain w-full h-full"
        />
      ),
      link: "/",
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
    route.push(link);
  };

  const route = useRouter();
  const pathname = usePathname();

  return (
    <>
      <div
        className="fixed bottom-3 p-1 h-fit left-1/2 transform -translate-x-1/2 
      w-[95%] max-w-xl bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl flex justify-around items-center z-50 text-xs"
      >
        {NavigationItems.map((item, index) => {
          return (
            <div
              key={index}
              className={`w-full flex items-center z-50 justify-center rounded-2xl relative`}
            >
              <button
                onClick={() => handleRoute(item.link)}
                className={` text-center flex items-center justify-center flex-col flex-wrap text-[#85827d] `}
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
    </>
  );
};

export default BottomNavigation;
