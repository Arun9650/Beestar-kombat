"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { beeAvatar, Diamond, MainBee } from "../../../public/newImages";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const skinsData = [
  { name: 'Default', icon: {MainBee}, purchased: true, featured: true },
  { name: 'Bron', icon: {MainBee}, purchased: false, featured: true },
  { name: 'Rafa', icon: {MainBee}, purchased: false, featured: false },
  { name: 'Tobi', icon: {MainBee}, purchased: false, featured: false },
  { name: 'Bakhodir', icon: {MainBee}, purchased: false, featured: false },
  { name: 'Archy', icon: {MainBee}, purchased: false, featured: false },
  { name: 'Swimmy', icon: {MainBee}, purchased: false, featured: false },
  { name: 'Footy', icon: {MainBee}, purchased: false, featured: false },
  { name: 'Flexy', icon: {MainBee}, purchased: false, featured: false },
  { name: 'Volley', icon: {MainBee}, purchased: false, featured: false },
];


const SkinPage = () => {

  const [selectedSkin, setSelectedSkin] = useState(skinsData[0]);
  const [tab, setTab] = useState('Featured');

  const router = useRouter();

  const achievements = [{ name: "10 cards", icon: Diamond, unlocked: true }];


  const filteredSkins = tab === 'Featured' ? skinsData.filter(skin => skin.featured) : skinsData;

  return (
    <div className=" h-screen py-4  text-white bg-black">
      <div className="flex items-center w-full   ">
        <div className="text-2xl  relative mx-auto w-full flex items-center justify-center ">
          <ArrowLeft
            className="absolute top-1/2 left-0  -translate-y-1/2 transform "
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
        <h1 className="text-xl text-white font-medium">Arun Kumar</h1>
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
      <header className="p-4  grid grid-cols-2  ">
        <h1 className="text-lg font-bold">Skin</h1>
        <div className="grid grid-cols-2 text-sm space-x-2  bg-[#1d2025b7] p-2 rounded-2xl">
          <button
            className={`px-2 py-2 rounded-xl ${tab === 'Featured' ? 'bg-[#1d2025] text-white' : ''}`}
            onClick={() => setTab('Featured')}
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
      <main className="p-4 bg-[#1d2025b7]  h-full rounded-t-3xl">
        <div className="flex gap-2">
          <div className="w-1/2  flex-grow ">
            <Image src={selectedSkin.icon.MainBee} alt={selectedSkin.name} className="w-full h-auto" />
            <h2 className="text-center text-xl font-bold mt-4">{selectedSkin.name}</h2>
            <p className="text-center text-green-500">{selectedSkin.purchased ? 'Purchased' : 'Not Purchased'}</p>
            <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded">Choose</button>
          </div>
          <div className="w-1/2 flex-grow  overflow-hidden">
            <div className="grid grid-cols-2 gap-2 h-[316px]  overflow-y-auto ">
              {filteredSkins.map((skin, index) => (
                <div
                  key={index}
                  className={`relative py-2 px-4 h-fit rounded-lg bg-[#1d2025] ${selectedSkin.name === skin.name ? 'border-2 border-blue-500' : ''}`}
                  onClick={() => setSelectedSkin(skin)}
                >
                  <Image src={skin.icon.MainBee} alt={skin.name} width={100} height={100} className="w-full h-auto mb-2" />
                  <p className="text-center text-xs">{skin.name}</p>
                  {!skin.purchased && <div className="absolute top-2 right-2 text-blue-500">🔒</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default SkinPage;
