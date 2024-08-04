
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { SlArrowRight } from "react-icons/sl";
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';

const Settings = () => {
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [coinsAnimation, setCoinsAnimation] = useState(true);

  const router = useRouter();

  return (
    <div className="h-screen bg-black text-white">
      <main className="p-4">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="space-y-2">
          <div className="bg-[#1d2025] p-4 rounded-2xl flex items-center justify-between">
            <div>
            <h3 className="text-sm font-medium">Select language</h3>
            <p className="text-gray-400 text-xs">English</p>
            </div>
            <SlArrowRight className='text-gray-400' />
          </div>
          <div onClick={() => {router.push('exchange')}} className="bg-[#1d2025] p-4 rounded-2xl  flex items-center justify-between">
            <div>
            <h3 className="text-sm font-medium">Choose exchange</h3>
            <p className="text-gray-400 text-xs">Binance</p>
            </div>
            <SlArrowRight className='text-gray-400' />
          </div>
          <div className="bg-[#1d2025] p-4 rounded-2xl  flex items-center justify-between">
            <h3 className="text-sm font-medium">Delete account</h3>
            <SlArrowRight className='text-gray-400' />
          </div>
          <div className="px-4 rounded-lg flex items-center justify-between">
            <label htmlFor='haptic' className="inline-flex items-center">
            <h3 className="text-sm font-medium">Haptic Feedback</h3>
            </label>
              <Switch
               id='haptic'
              />
          </div>
          <div className=" px-4 rounded-lg flex items-center justify-between">
            <label htmlFor='coins' className="inline-flex items-center">
            <h3  className="text-sm font-medium">Coins animation</h3>
                </label>
              <Switch id="coins" />
          </div>
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
