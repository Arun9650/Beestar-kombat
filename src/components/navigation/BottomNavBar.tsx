'use client';
import React from "react";
import Mine from "../../../public/icons/Mine";
import Friends from "../../../public/icons/Friends";
import Image from "next/image";
import { FaGamepad } from "react-icons/fa6";
import Coins from "../../../public/icons/Coins";
import { BeeCoin, SponsorImage } from "../../../public/newImages";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const BottomNavBar = () => {
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
      icon: <FaGamepad className="w-6 h-6 mx-auto" />,
      link: "/",
    },
    {
      name: "Earn",
      icon: <Coins className="w-6 h-6 mx-auto" />,
      link: "/market",
    },
    {
      name: "AirDrop",
      icon: <Image src={SponsorImage} width={24} height={24} alt="AirDrop" />,
      link: "/bonus",
    },
  ];

  const route = useRouter();
  const pathname = usePathname();

  const search = useSearchParams();

  const id  = search.get('id');

  const handleRoute = (link: string) => {
    const linkWithId = id ? `${link}?id=${id}` : link;
    route.push(linkWithId);
  };


  return (
    <div
      className="fixed bottom-3 p-2 h-fit left-1/2 transform -translate-x-1/2 
      w-[95%] max-w-xl bg-black bg-opacity-60  backdrop-blur-lg rounded-3xl flex justify-around items-center  text-xs"
    >
      {NavigationItems.map((item, index) => {
        return (
          <div
            key={index}
          >
            <button
              onClick={() => handleRoute(item.link)}
              className={`  flex items-center justify-center flex-col  text-[#85827d] `}
            >
              <div
                className={`${
                  pathname === item.link ? " text-white" : ""
                } mx-auto  `}
              >
                {item.icon}
              </div>
              <p
                className={` text-[10px] ${
                  pathname === item.link ? " text-white" : ""
                }  `}
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

export default BottomNavBar;
