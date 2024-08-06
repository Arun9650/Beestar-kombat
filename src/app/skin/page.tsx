"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { beeAvatar, coolBee, Diamond, dollarCoin, MainBee } from "../../../public/newImages";
import { useRouter  } from "next/navigation";
import Skinmini from "@/components/Skinmini";
import { getUserConfig } from "@/actions/user.actions";





const SkinPage = () => {


  const [tab, setTab] = useState('featured');
  
  const [userName, setUserName] = useState("");

  const router = useRouter();
  

  const achievements = [{ name: "10 cards", icon: Diamond, unlocked: true }];


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
    <div className="h-full min-h-screen mb-16 overflow-hidden   text-white bg-black">
      <div className="flex items-center w-full   ">
        <div className="text-2xl  relative mx-auto w-full flex items-center justify-center ">
          <ArrowLeft
            className="absolute top-1/2 left-10  -translate-y-1/2 transform "
            onClick={() => {
              router.push("/");
            }}
          />
          <h1>Profile</h1>
        </div>
      </div>

      <div className="flex items-center gap-4 my-2 px-4 border-b-[1px] py-4">
        <Image
          src={beeAvatar}
          alt="Avatar"
          width={50}
          height={50}
          className="rounded-2xl"
        />
        <h1 className="text-xl text-white font-medium">{userName}</h1>
      </div>

      <div className="flex justify-between flex-col  my-8 rounded-2xl p-4 bg-[#1d2025b7]">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-xl">Achievements</h1>
          <Button onClick={() => {router.push('achievements')}} className="text-white bg-purple-700 rounded-xl">
            {" "}
            See all{" "}
          </Button>
        </div>

        <div className=" space-x-2 overflow-x-auto mt-4 grid grid-cols-4">
          {achievements.map((milestone, index) => (
            <div
              key={index}
              className={`flex flex-col justify-center  items-center bg-[#1d2025] h-20 rounded-lg ${
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
      <div className="">
      <header className="p-4 pt-0  grid grid-cols-2   ">
        <h1 className="text-lg  font-bold">Skin</h1>
        <div className="grid grid-cols-2 text-sm space-x-2  bg-[#1d2025b7] p-2 rounded-2xl">
          <button
            className={`px-2 py-2 rounded-xl ${tab === 'featured' ? 'bg-[#1d2025] text-white' : ''}`}
            onClick={() => setTab('featured')}
          >
            Featured
          </button>
          <button
            className={`px-4 py-2 rounded-xl ${tab === 'All' ? 'bg-[#1d2025] text-white' : ''}`}
            onClick={() => setTab('All')}
          >
            All
          </button>
        </div>
      </header>
      <main className="p-4 bg-[#1d2025b7] min-h-40  rounded-t-3xl">
       <Skinmini tab={tab} />
      </main>
      </div>
    </div>
  );
};

export default SkinPage;
