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
    <div className="px-4 flex-grow  backdrop-blur-none rounded-t-3xl top-glow border-t-4 border-[#f3ba2f]    text-white bg-black bg-opacity-60">
      <div className="flex items-center w-full  justify-center   ">
        <div className="text-2xl  pt-4 ">
          {/* <ArrowLeft
            className="absolute top-1/2 left-10  -translate-y-1/2 transform "
            onClick={() => {
              router.push("/");
            }}
          /> */}
          <h1>Profile</h1>
        </div>
      </div>

    
      <div className="flex px-3 py-2 bg-[#1d2025] bg-opacity-85 shadow-xl border border-yellow-400  backdrop-blur-none    flex-col  my-8 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-xl">Achievements</h1>
          <Button onClick={() => {router.push('achievements')}} className="bg-yellow-400 text-zinc-800 rounded-xl">
            {" "}
            See all{" "}
          </Button>
        </div>

        <div className=" space-x-2 overflow-x-auto mt-4 grid grid-cols-4">
          {achievements.map((milestone, index) => (
            <div
              key={index}
              className={`flex flex-col justify-center  items-center bg-[#1d2025] border border-yellow-400 h-20 rounded-lg ${
                milestone.unlocked ? "" : "opacity-50"
              }`}
            >
              <Image
                src={milestone.icon}
                alt={milestone.name}
                width={30}
                height={30}
                className="mb-2"
              />
              <p className="text-center text-[10px] w-full min-w-full ">
                {milestone.name}
              </p>
            </div>
          ))}
        </div>
       
      </div>
      <div className="h-full">
      <header className="p-4 pt-0  grid grid-cols-2   ">
        <h1 className="text-lg  font-bold">Skin</h1>
        <div className="grid grid-cols-2 text-sm space-x-2  border border-yellow-400 bg-[#1d2025] bg-opacity-85 shadow-xl p-2 rounded-2xl">
          <button
            className={`py-2 rounded-lg ${tab === 'featured' ? 'bg-yellow-400 text-zinc-800' : ''}`}
            onClick={() => setTab('featured')}
          >
            Featured
          </button>
          <button
            className={` py-2 rounded-lg ${tab === 'All' ? 'bg-yellow-400 text-zinc-800' : ''}`}
            onClick={() => setTab('All')}
          >
            All
          </button>
        </div>
      </header>
      <main className="p-4 mb-16 bg-[#1d2025] bg-opacity-85 shadow-xl border border-yellow-400 min-h-40 h-full  rounded-3xl">
       <Skinmini tab={tab} />
      </main>
      </div>
    </div>
  );
};

export default SkinPage;
