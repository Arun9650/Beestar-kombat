"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { beeAvatar, coolBee, Diamond, dollarCoin, MainBee } from "../../../public/newImages";
import { useRouter  } from "next/navigation";
import Skinmini from "@/components/Skinmini";
import { getUserConfig } from "@/actions/user.actions";
import { useBoostersStore } from "@/store/useBoostrsStore";
import { usePointsStore } from "@/store/PointsStore";
import SectionBanner from "@/components/sectionBanner";





const SkinPage = () => {


  const [tab, setTab] = useState('featured');
  
  const [userName, setUserName] = useState("");

  const router = useRouter();
  

  const achievements = [{ name: "10 cards", icon: Diamond, unlocked: true }];

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


useEffect(() => {
  const userId = window.localStorage.getItem("authToken");

  const fetchUser = async () => {
    const response = await getUserConfig(userId!);
    if(response.user.name){
      setUserName(response.user.name);
    }
  }

  fetchUser();
}, []);



  return (
    <div className="">
      <SectionBanner
      mainText="Profile"
      subText="Change settings according to yourself"
      leftIcon="/newImages/bee.png"
      rightIcon="/newImages/bee-right.png"
      />

      <div className="h-full">
      <header className="p-4 pt-10  grid grid-cols-2   ">
        <h1 className="text-lg  font-bold">Skin</h1>
        <div className="grid grid-cols-2 text-sm space-x-2 rounded-2xl">
          <button
            className={`py-2 rounded-lg ${tab === 'featured' ? 'bg-custom-orange text-white' : ''}`}
            onClick={() => setTab('featured')}
          >
            Featured
          </button>
          <button
            className={` py-2 rounded-lg ${tab === 'All' ? 'bg-custom-orange text-white' : ''}`}
            onClick={() => setTab('All')}
          >
            All
          </button>
        </div>
      </header>
      <main className="p-4  bg-[#252423] h-full  rounded-3xl">
       <Skinmini tab={tab} />
      </main>
      </div>
    </div>
  );
};

export default SkinPage;
