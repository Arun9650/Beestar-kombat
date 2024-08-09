'use client'
// pages/boosters.js
import React from 'react';
import { dollarCoin, honeycomb, recharge, rocket } from '../../../public/newImages';
import Image from 'next/image';
import { usePointsStore } from '@/store/PointsStore';
import { SlArrowRight } from 'react-icons/sl';

const freeBoosters = [
  { name: 'Full energy', status: '6/6 available', icon: honeycomb },
  { name: 'Turbo', status: 'Coming soon', icon: rocket },
];

const boosters = [
  { name: 'Energy limit', cost: '2K', level: '2 lvl', icon: recharge },
];

const Boosters = () => {
    const { points } = usePointsStore()

  return (
    <div className="min-h-screen  bg-black bg-opacity-60 backdrop-blur-none rounded-t-3xl top-glow border-t-4 border-[#f3ba2f] text-white">
      <div className="p-4">
        <div className="text-center mb-8">
          <p className="text-gray-400">Your balance</p>
          <div className="flex justify-center items-center">
            <Image src={dollarCoin} alt="Coin" className="w-6 h-6 mr-2" />
            <p className="text-3xl font-bold">{points.toString()}</p>
          </div>
          <p className="text-yellow-500 mt-2">How a boost works</p>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">Free daily boosters</h2>
          {freeBoosters.map((booster) => (
            <div key={booster.name} className="flex items-center bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none  p-2 rounded-2xl mb-2">
              <Image src={booster.icon} alt={booster.name} width={50} height={50} className="w-8 h-8 mr-4" />
              <div className="flex-1">
                <p className="font-bold">{booster.name}</p>
                <p className="text-gray-400">{booster.status}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">Boosters</h2>
          {boosters.map((booster) => (
            <div key={booster.name} className="flex items-center bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none   p-2 rounded-2xl mb-2">
            <Image src={booster.icon} alt={booster.name} width={50} height={50} className="w-8 h-8 mr-4" />
              <div className="flex-1">
                <p className="font-bold">{booster.name}</p>
                <div className="flex items-center text-gray-400">
                  <Image src={dollarCoin} alt="Coin" width={50} height={50} className="w-4 h-4 mr-1" />
                  <span>{booster.cost}</span>
                  <span className="ml-2">{booster.level}</span>
                </div>
              </div>
              <span className="text-gray-400">
              <SlArrowRight className='text-gray-400' />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Boosters;
