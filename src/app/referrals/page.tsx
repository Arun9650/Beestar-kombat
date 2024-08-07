'use client';

import Copy from '../../../public/icons/Copy';
import {  Gift } from '../../../public/newImages';
import Image from 'next/image';
import React, { useState } from 'react';

const ReferralPage = () => {


  const [isTapped, setIsTapped] = useState(false);

  const handleTap = () => {
    setIsTapped(true);
    navigator.clipboard.writeText("https://tonswap.io/referrals");
    setTimeout(() => setIsTapped(false), 200); // Reset the tap animation after 200ms
  };


  return (
    <div className="p-4 bg-black mb-16 text-white min-h-screen  shadow-lg max-w-xl mx-auto">
      <h1 className="text-4xl mt-5 font-bold mx-auto  flex justify-center ">Invite friends!</h1>
      <p className="mb-4  flex justify-center mt-4">You and your friend will receive bonuses</p>
      <div className="space-y-4">
        <div className="p-4 bg-gray-800 rounded-2xl flex items-center justify-between">
          <div className="flex items-center">
            <Image src={Gift} alt="Gift" className="w-16 h-16 mr-4" />
            <div>
              <p className="font-semibold ">Invite a friend</p>
              <p className="text-yellow-400">+5,000 for you and your friend</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-2xl flex items-center justify-between">
          <div className="flex items-center">
            <Image src={Gift} alt="Gift" className="w-16 h-16 mr-4 " />
            <div>
              <p className="font-semibold text-xl" >Invite a friend with Telegram Premium</p>
              <p className="text-yellow-400">+25,000 for you and your friend</p>
            </div>
          </div>
        </div>
      </div>
      <a href="#" className="text-blue-400 mt-4 block text-center">More bonuses</a>
      <h2 className="mt-6 mb-2">List of your friends</h2>
      <div className="bg-gray-800 p-4 rounded-3xl text-center">
        <p className="text-gray-400 p-4">You haven&apos;t invited anyone yet</p>
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <button className="bg-blue-600 py-4 px-4 rounded-2xl w-full semi-bold text-2xl ">Invite a friend</button>
        <button onClick={handleTap} className={`bg-blue-600 py-2 px-4 rounded-2xl ${isTapped ? 'scale-95' : ''} transition-transform duration-200`}>
     
          <Copy className='w-6 h-6 text-white' />
        </button>
      </div>
    </div>
  );
};

export default ReferralPage;
