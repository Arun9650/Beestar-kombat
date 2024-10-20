"use client";

import { Button } from "@/components/ui/button";
import Copy from "../../../public/icons/Copy";
import { dollarCoin, Gift } from "../../../public/newImages";
import Image from "next/image";``
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";
import useFetchUserReferred from "@/hooks/query/useFetchUserReferred";
import SectionBanner from "@/components/sectionBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { initUtils } from '@telegram-apps/sdk'
import { formatNumber } from "../../../utils/formatNumber";
const ReferralPage = () => {
  const [isTapped, setIsTapped] = useState(false);
  const [id, setId] = useState("");

   const INVITE_URL = "https://t.me/BeestarKombat_bot/beestarkombat"
  //  const INVITE_URL = 'https://t.me/beestar_devbot/start'

  const handleTap = () => {
    setIsTapped(true);
    navigator.clipboard.writeText(
      `http://t.me/BeestarKombat_bot/beestarkombat?startapp=${id}`
    );
    setTimeout(() => setIsTapped(false), 2000); // Reset the tap animation after 200ms
  };

  const { currentTapsLeft, increaseTapsLeft } = usePointsStore();
  const { multiClickLevel } = useBoostersStore();

  const { data, isLoading } = useFetchUserReferred(id);
  console.log("🚀 ~ ReferralPage ~ data:", data);


  const handleLick = () => {
    window.location.href = `https://t.me/BeestarKombat_bot/start?start=${id}`
  }

  const handleInviteFriend = () => {
    const utils = initUtils()
    const inviteLink = `${INVITE_URL}?startapp=${id}`
    const shareText = `Join me on this awesome Telegram mini app!`
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`
    utils.openTelegramLink(fullUrl)
  }


  useEffect(() => {
    const checkWindowAndSetId = () => {
      if (typeof window !== "undefined") {
        const user = window.localStorage.getItem("authToken");
        if (user) {
          setId(user);
        }
      } else {
        setTimeout(checkWindowAndSetId, 1000); // Retry after 1 second
      }
    };

    checkWindowAndSetId();
  }, []);

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
    <div className="px-4 text-white flex flex-col ">

        <SectionBanner
        mainText="Invite friends"
        subText="You and your friend will receive bonuses"
        leftIcon="/newImages/bee.png"
        rightIcon="/newImages/bee-right.png"
        />

      <div className="flex justify-center flex-col gap-6 mt-2">
        <div className="flex items-center gap-5 px-3 py-2 bg-[#1d2025] rounded-2xl">
          {/* card1 */}
          <Image src={Gift} alt="Gift"  width={24} height={24} />
          <div>
            <p className="font-semibold">Invite a friend</p>
            <p className="text-yellow-400 text-xs">+5,000 for you and your friend</p>
          </div>
        </div>
      </div>
      <div className="flex gap-3 my-4">
        {/* button */}
        <Button className="bg-black/80 shadow-2xl border-yellow-400 border p-1 rounded-2xl justify-center gap-2 flex w-full py-4 px-4  semi-bold text-sm ">
          {id ? (
            <Button
            style={{ width: "100%" }}
              // onClick={() => handleLick()}
              onClick={ () => handleInviteFriend()}
            >
              Invite a friend
            </Button>
          ) : (
            <Skeleton className="w-full "/> // Placeholder while id is being set
          )}
        </Button>
        <button
          onClick={handleTap}
          className={`bg-yellow-400 border border-black  py-2 px-4 rounded-2xl ${
            isTapped ? "scale-95" : ""
          } transition-transform duration-200`}
        >
          {isTapped ? (
            <IoCheckmarkDoneSharp className="w-6 h-6 text-black" />
          ) : (
            <Copy className="w-6 h-6 text-black" />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-4 items-center justify-center w-full  bg-opacity-85   ">
        {isLoading ? (
          <Skeleton className="w-full h-20" />
        ) : (
          <>
            {data?.length === 0 ? (
              <p className="my-20">No referrals found</p>
            ) : (
            <>
            <div>
              Total Referrals: {data?.length}
            </div>
             { data?.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-2xl  w-full"
                  >
                    <div>

                    <p className="truncate  w-40 "><span className="text-gray-400">#{index +1}</span> {item.name}</p>
                  <p className="ml-5 gap-3 flex items-center">
                  {item.league}
                  <span className="flex items-center"> <Image src={dollarCoin} width={20} height={20} alt="coin" />{item.profitPerHour} <span className="text-gray-400 text-xs"> {"  "}/hour </span> </span>
                  </p>
                    </div>
                  <p className="flex items-center gap-3">
                    <Image src={dollarCoin} width={20} height={20} alt="coin" />
                    {formatNumber(item.points)}
                  </p>
                
                </div>
              ))}
                  </>
            )}
          </>
        )}
      </div>

  
    </div>
  );
};

export default ReferralPage;
