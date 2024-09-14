'use client';

import { Button } from '@/components/ui/button';
import Copy from '../../../public/icons/Copy';
import { dollarCoin, Gift } from '../../../public/newImages';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { TelegramShareButton } from 'react-share';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { usePointsStore } from '@/store/PointsStore';
import { useBoostersStore } from '@/store/useBoostrsStore';
import useFetchUserReferred from '@/hooks/query/useFetchUserReferred';

const ReferralPageClient = ({id} : {id: string}) => {
  console.log("🚀 ~ ReferralPageClient ~ id:", id)
  const [isTapped, setIsTapped] = useState(false);
//   const [id, setId] = useState<string | null>(null);

  const handleTap = () => {
    setIsTapped(true);
    if (id) {
      navigator.clipboard.writeText(`http://t.me/BeestarKombat_bot/start?start=${id}`);
    }
    setTimeout(() => setIsTapped(false), 2000); // Reset the tap animation after 2 seconds
  };

  const { currentTapsLeft, increaseTapsLeft } = usePointsStore();
  const { multiClickLevel } = useBoostersStore();
  const { data, isLoading } = useFetchUserReferred(id!);

  // Retrieve the referral ID from local storage
//   useEffect(() => {
//     const userId = window.localStorage.getItem('authToken');
//     if (userId) {
//       setId(userId);
//     }
//   }, []);

  // Interval to manage taps and update local storage
  useEffect(() => {
    const intervalId = setInterval(() => {
      increaseTapsLeft();
      const currentTime = Date.now();
      window.localStorage.setItem('lastLoginTime', currentTime.toString());
      const localTapsLeft = parseInt(window.localStorage.getItem('currentTapsLeft') ?? '0');
      if (localTapsLeft < currentTapsLeft && !isNaN(currentTapsLeft)) {
        window.localStorage.setItem('currentTapsLeft', (currentTapsLeft + multiClickLevel).toString());
      }
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [currentTapsLeft, multiClickLevel]);

  return (
    <>
    <div className="px-4 flex-grow bg-black bg-opacity-60 backdrop-blur-none rounded-t-3xl top-glow border-t-4 border-[#f3ba2f] text-white flex flex-col gap-16">
      {/* Invite Section */}
      <div>
        <h1 className="text-4xl mt-5 font-bold mx-auto flex justify-center">Invite friends!</h1>
        <p className="mb-4 flex justify-center mt-4">You and your friend will receive bonuses</p>
      </div>

      {/* Bonus Information Cards */}
      <div className="flex justify-center flex-col gap-6">
        <div className="flex items-center px-3 py-2 bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none rounded-2xl">
          <Image src={Gift} alt="Gift" className="w-16 h-16" />
          <div>
            <p className="font-semibold">Invite a friend</p>
            <p className="text-yellow-400">+5,000 for you and your friend</p>
          </div>
        </div>
      </div>

      {/* Referrals Section */}
      <div className="flex flex-col gap-4 items-center justify-center w-full bg-opacity-85">
        {isLoading ? (
          <div className="loader mx-auto"></div>
        ) : (
          <>
            {data?.length === 0 ? (
              <p>No referrals found</p>
            ) : (
              data?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-2xl border-yellow-400 w-full">
                  <p>{item.name}</p>
                  <p className="flex items-center gap-3">
                    <Image src={dollarCoin} width={20} height={20} alt="coin" />
                    {item.points}
                  </p>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Share & Copy Buttons */}
      <div className="flex gap-3 mb-24">
        <Button className="bg-black/80 shadow-2xl border-yellow-400 border p-1 rounded-2xl justify-center gap-2 flex w-full py-4 px-4 semi-bold text-sm">
          {id ? (
            <TelegramShareButton 
            title="Join Beestar Kombat!"
            
            // description="Join Beestar Kombat through my link and get rewards when you sign up!"
            // image="https://yourdomain.com/path-to-image.jpg" // Replace with the actual image URL
             style={{ width: '100%' }} url={`https://beestar-kombat-omega.vercel.app/referrals?id=${id}`}>
              Invite a friend
            </TelegramShareButton>
          ) : (
              <div className="loader"></div>
            )}
        </Button>

        <button
          onClick={handleTap}
          className={`bg-yellow-400 border border-black py-2 px-4 rounded-2xl ${isTapped ? 'scale-95' : ''} transition-transform duration-200`}
          >
          {isTapped ? (
              <IoCheckmarkDoneSharp className="w-6 h-6 text-black" />
            ) : (
                <Copy className="w-6 h-6 text-black" />
            )}
        </button>
      </div>
    </div>
            </>
  );
};

export default ReferralPageClient;
