'use client';

import { Button } from '@/components/ui/button';
import Copy from '../../../public/icons/Copy';
import {  Gift } from '../../../public/newImages';
import Image from 'next/image';
import React, { useState } from 'react';
import { TelegramShareButton } from 'react-share'
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
const ReferralPage = () => {


  const [isTapped, setIsTapped] = useState(false);

  const handleTap = () => {
    setIsTapped(true);
    navigator.clipboard.writeText("https://tonswap.io/referrals");
    setTimeout(() => setIsTapped(false), 2000); // Reset the tap animation after 200ms
  };


  return (
    <div className="px-4 flex-grow bg-black bg-opacity-60 backdrop-blur-none rounded-t-3xl top-glow border-t-4 border-[#f3ba2f]  text-white  flex flex-col gap-16 ">
     <div>
     <h1 className="text-4xl mt-5 font-bold mx-auto  flex justify-center ">Invite friends!</h1>
     <p className="mb-4  flex justify-center mt-4">You and your friend will receive bonuses</p>
     </div>


      <div className='flex justify-center flex-col gap-6'>
        <div className='flex items-center px-3 py-2 bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none  rounded-2xl'>
          {/* card1 */}
          <Image src={Gift} alt="Gift" className="w-16 h-16" />
            <div>
              <p className="font-semibold ">Invite a friend</p>
              <p className="text-yellow-400">+5,000 for you and your friend</p>
            </div>
        </div>
        <div className='flex items-center px-3 py-2 bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none  rounded-2xl'>
          {/* card2 */}
          <Image src={Gift} alt="Gift" className="w-16 h-16" />
            <div>
              <p className="font-semibold ">Invite a friend with Telegram Premium</p>
              <p className="text-yellow-400">+25,000 for you and your friend</p>
            </div>
        </div>
        
      </div>

      <div className='flex  gap-3 '>
          {/* button */}
          <Button className="bg-black/80 shadow-2xl border-yellow-400 border p-1 rounded-2xl justify-center gap-2 flex w-full py-4 px-4  semi-bold text-sm ">
          <TelegramShareButton url="https://tonswap.io/referrals" >
          Invite a friend
          </TelegramShareButton>
          </Button>
        <button onClick={handleTap} className={`bg-yellow-400 border border-black  py-2 px-4 rounded-2xl ${isTapped ? 'scale-95' : ''} transition-transform duration-200`}>
     
          {
            isTapped ? ( <IoCheckmarkDoneSharp className='w-6 h-6 text-black' /> ) : (<Copy className='w-6 h-6 text-black' />)
          }
          
         
        </button>
        </div>
    </div>
  );
};

export default ReferralPage;
