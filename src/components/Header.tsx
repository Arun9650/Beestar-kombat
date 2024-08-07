'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { beeAvatar, binanceLogo, dollarCoin } from '../../public/newImages'
import Info from '../../public/icons/Info'
import Settings from '../../public/icons/Settings'
import { useRouter } from 'next/navigation'
import { usePointsStore } from '@/store/PointsStore'
import useExchangeStore from '@/store/useExchangeStore'
import Link from 'next/link'
const Header = () => {

  const levelNames = [
    "Bronze",    // From 0 to 4999 coins
    "Silver",    // From 5000 coins to 24,999 coins
    "Gold",      // From 25,000 coins to 99,999 coins
    "Platinum",  // From 100,000 coins to 999,999 coins
    "Diamond",   // From 1,000,000 coins to 2,000,000 coins
    "Epic",      // From 2,000,000 coins to 10,000,000 coins
    "Legendary", // From 10,000,000 coins to 50,000,000 coins
    "Master",    // From 50,000,000 coins to 100,000,000 coins
    "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
    "Lord"       // From 1,000,000,000 coins to ∞
  ];

  const levelMinPoints = [
    0,        // Bronze
    5000,     // Silver
    25000,    // Gold
    100000,   // Platinum
    1000000,  // Diamond
    2000000,  // Epic
    10000000, // Legendary
    50000000, // Master
    100000000,// GrandMaster
    1000000000// Lord
  ];


  const router = useRouter();

  const userName = window.localStorage.getItem('userName');
  const {PPH, points} = usePointsStore();

  const {exchange} = useExchangeStore();
  const [levelIndex, setLevelIndex] = useState(6);

  
  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);



  return (
    <div className='w-full px-4 z-10'>
         <div className="w-full  z-10">
          <div className="flex items-center space-x-2 pt-1">
            
            <button onClick={() => router.push('skin')} className='flex items-center  gap-4 mt-2 mb-0 '>
              <Image src={beeAvatar} alt="Avatar" width={25} height={25} className='rounded-2xl' />
              <p className="text-xs">{userName} (CEO)</p>
            </button>
          </div>
          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3">
              <div onClick={() => router.push('leaderboard')}  className="w-full">
                <div className="flex items-baseline  justify-between">
                  <p className="text-[8px]">{levelNames[levelIndex]}</p>
                  <p className="text-sm">{levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p>
                </div>
                <div className="flex items-center  border-2 border-[#43433b] rounded-full">
                  <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                    <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
              <Link  href={"exchange"}>
              <Image src={exchange?.icon || binanceLogo} alt="Exchange" className="w-5 h-5" />
              </Link>
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <div className="flex-1 text-center">
                <p className="text-[10px] text-[#85827d] font-medium">Profit per hour</p>
                <div className="flex items-center justify-center space-x-1">
                  <Image src={dollarCoin} alt="Dollar Coin" className="w-[18px] h-[18px]" />
                  <p className="text-sm">{PPH}</p>
                  <Info size={20} className="text-[#43433b]" />
                </div>
              </div>
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <button onClick={() => {router.push("/settings")}}>

              <Settings className="text-white" size={18}  />
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Header