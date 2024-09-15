"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SlArrowRight } from "react-icons/sl";
import { useRouter, useSearchParams } from "next/navigation";
import useExchangeStore from "@/store/useExchangeStore";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import Image from "next/image";
import { dollarCoin } from "../../../public/newImages";
import { Button } from "@/components/ui/button";
import { DeleteUser } from "@/actions/user.actions";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";
import SectionBanner from "@/components/sectionBanner";
import { ChevronRight, Trash } from "lucide-react";
import useLanguageStore from "@/store/uselanguageStore";
import { CircleFlag } from "react-circle-flags";
import WebApp from "@twa-dev/sdk"
import { initClosingBehavior, initUtils } from '@telegram-apps/sdk';

declare global {
  interface Window {
    Telegram: any;
  }
}

const Settings = () => {
  const { exchange } = useExchangeStore();

  const route = useRouter();

  const search = useSearchParams();

  const id = search.get("id");

  const handleRoute = (link: string) => {
    const linkWithId = id ? `${link}?id=${id}` : link;
    route.push(linkWithId);
  };
  const { setPoints } = usePointsStore();

  const [buttonLoading, setButtonLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { currentTapsLeft, increaseTapsLeft, setCurrentTapsLeft, setPPH } =
    usePointsStore();
  const { multiClickLevel } = useBoostersStore();
  const { language, languageCode} = useLanguageStore();
   const INVITE_URL = "https://t.me/BeestarKombat_bot/beestarkombat"
  const handleInviteFriend = () => {
    const utils = initUtils()
    const inviteLink = `${INVITE_URL}?startapp=${id}`
    const shareText = `Join me on this awesome Telegram mini app!`
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`
    utils.openTelegramLink(fullUrl)
  }


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

  const handleDeleteUser = async () => {
    if (typeof window === "undefined") {
      setTimeout(handleDeleteUser, 10);
      return;
    }

    window.localStorage.removeItem("BoostersEnergy");
    window.localStorage.removeItem("exchange");
    window.localStorage.removeItem("points");
    window.localStorage.setItem("points", "0");
    setPoints(0);
    setPPH(0);

    window.localStorage.removeItem("userName");
    window.localStorage.removeItem("currentTapsLeft");
    window.localStorage.removeItem("energyCapacity");
    window.localStorage.removeItem("lastLoginDate");
    window.localStorage.removeItem("rechargeVelocity");
    window.localStorage.removeItem("multiClickLevel");
    window.localStorage.removeItem("multiClickCost");
    window.localStorage.removeItem("refill");
    window.localStorage.removeItem("PPH");
    window.localStorage.removeItem("lastLoginTime");
    window.localStorage.removeItem("freeEnergy");
    window.localStorage.removeItem("lastDateFreeEnergy");

    const userId = window.localStorage.getItem("authToken");
    setButtonLoading(true);
    const result = await DeleteUser(userId!);
    window.localStorage.removeItem("authToken");
    window.localStorage.clear();

    window.localStorage.setItem("currentTapsLeft", "500");
    window.localStorage.setItem("energyCapacity", "500");
    setCurrentTapsLeft(500);
    if (result.success) {
      setButtonLoading(false);
      // WebApp.close();
      if (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.close();  // Close using Telegram WebApp API
      }
      route.push("/");
    }
  };

  return (
    <div className=" bg-black text-white">
      <main className="">
        <SectionBanner
          mainText="Settings"
          subText="Change settings according to yourself"
          leftIcon="/newImages/bee.png"
          rightIcon="/newImages/bee-right.png"
        />
        <div className="divide-y grid grid-rows-3 divide-[#F7D1A6]">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center  ">
              <Image
                src={"/newImages/language.png"}
                alt="YouTube"
                className="mr-2 border-2 border-white border-opacity-10 bg-white bg-opacity-10 p-2.5 rounded-xl "
                width={50}
                height={50}
              />
              <div>
                <h3 className="text-xs font-medium">Choose your language</h3>
                <p className="text-custom-orange text-[0.6rem] flex items-center">
                  select Language
                  <ChevronRight
                    strokeWidth={2}
                    className="text-[#FFA41C]"
                    size={18}
                  />
                </p>
              </div>
            </div>
            <Button onClick={() => handleRoute("/language")} className="flex items-center justify-between text-xs w-32">
            {/* <Image src={exchange.icon} alt="YouTube" width={20} height={20} className="mr-2" /> */}
            <CircleFlag
                countryCode={languageCode.toLocaleLowerCase()}
                height={5}
                width={12}
              />
           {language}
              <ChevronRight strokeWidth={4} className="text-white" size={18} />
            </Button>
          </div>
           <div className="flex items-center justify-between">
            <div className="flex items-center ">
              <Image
                src={"/newImages/wallet.png"}
                alt="YouTube"
                className="mr-2 border-2 border-white border-opacity-10 bg-white bg-opacity-10 p-2.5 rounded-xl "
                width={50}
                height={50}
              />
              <div>
                <h3 className="text-xs font-medium">Choose your Wallet</h3>
                <p className="text-custom-orange text-[0.6rem] flex items-center">
                  selected Exchange
                  <ChevronRight
                    strokeWidth={2}
                    className="text-[#FFA41C]"
                    size={18}
                  />
                </p>
              </div>
            </div>
            <Button onClick={() => {
              handleRoute("exchange");
            }} className="flex items-center justify-between text-xs w-32">
              <Image src={exchange.icon} alt="YouTube" width={20} height={20} className="mr-2" />
              {exchange.name}
              <ChevronRight strokeWidth={4} className="text-white" size={18} />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center  ">
              <Image
                src={"/newImages/share.png"}
                alt="YouTube"
                className="mr-2 border-2 border-white border-opacity-10 bg-white bg-opacity-10 p-2.5 rounded-xl "
                width={50}
                height={50}
              />
              <div>
                <h3 className="text-sm font-medium">share Link</h3>
                <p className="text-custom-orange text-[0.6rem] flex items-center">
                  telegram/userid.link
                  <ChevronRight
                    strokeWidth={2}
                    className="text-[#FFA41C]"
                    size={18}
                  />
                </p>
              </div>
            </div>
            <Button onClick={() => handleInviteFriend()} className="flex items-center text-xs justify-between w-32">
            <Image src='/newImages/share-icon.png' alt="YouTube" width={20} height={20} className="mr-2" />
             share
              <ChevronRight strokeWidth={4} className="text-white" size={18} />
            </Button>
          </div>
            <div onClick={() => setIsDrawerOpen(true)} className="flex items-center justify-between py-3">
            <div className="flex items-center  ">
              <Trash strokeWidth={3}   className="mr-2 border-2 border-white border-opacity-10 bg-white bg-opacity-10 w-12 h-12  p-2.5 rounded-xl text-custom-orange"/>
              <div>
                <h3 className="text-sm font-medium">Delete Account</h3>
              </div>
            </div>
            <button  className="flex items-center text-xs justify-between bg-red-900 px-4 py-3 rounded-xl w-32"  >
            <Trash strokeWidth={3}   className="mr-2" size={16} />
             Delete
              <ChevronRight strokeWidth={4} className="text-white" size={18} />
            </button>
          </div>

          {
            <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
              <DrawerContent className="bg-[#14161a] border-none ">
                <DrawerHeader
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex text-white rounded-full justify-end  mr-0  w-full  items-center"
                >
                  <div className="p-3 px-5 bg-[#1C1F23] rounded-full">x</div>
                </DrawerHeader>
                <div className="text-center">
                  <h2 className="text-xl px-2 font-medium text-white mb-2">
                    {/* {selectedTeam.title} */}
                    Are you sure you want to delete your account?
                  </h2>
                  <p className="text-white text-xs px-2 mb-4 max-w-96 font-light mx-auto">
                    {/* {selectedTeam.description} */}
                    All your data, including game progress, achievements, and
                    purchases, will be permanently deleted. This action cannot
                    be undone.
                  </p>
                </div>

                <DrawerFooter>
                  <button
                    onClick={() => handleDeleteUser()}
                    className="w-full py-2 bg-red-500 text-white text-md rounded-lg "
                  >
                    {buttonLoading ? "Loading..." : "Delete account"}
                  </button>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full py-2 bg-[#1C1F23] text-white text-md rounded-lg "
                  >
                    Cancel
                  </button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          }
        </div>
        <div className="mt-8 text-center">
          <Link href="#">
            <p className="text-gray-400">Privacy policy</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Settings;
