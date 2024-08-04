'use client'
import Image from 'next/image'
import React from 'react'
import { beeAvatar, binanceLogo, dollarCoin } from '../../public/newImages'
import Info from '../../public/icons/Info'
import Settings from '../../public/icons/Settings'
import { useRouter } from 'next/navigation'
const Header = () => {
  const router = useRouter();
  return (
    <div className='w-full px-4 z-10'>
         <div className="w-full  z-10">
          <div className="flex items-center space-x-2 pt-1">
            
            <button onClick={() => router.push('skin')} className='flex items-center  gap-4 mt-2 mb-0 '>
              <Image src={beeAvatar} alt="Avatar" width={25} height={25} className='rounded-2xl' />
              <p className="text-xs">{"Arun"} (CEO)</p>
            </button>
          </div>
          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3">
              <div onClick={() => router.push('leaderboard')}  className="w-full">
                <div className="flex items-baseline  justify-between">
                  <p className="text-[8px]">{'Bronze'}</p>
                  <p className="text-sm">{  1} <span className="text-[#95908a]"></span></p>
                </div>
                <div className="flex items-center  border-2 border-[#43433b] rounded-full">
                  <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                    <div className="progress-gradient h-2 rounded-full" style={{ width: `${50}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
              <Image src={binanceLogo} alt="Exchange" className="w-5 h-5" />
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <div className="flex-1 text-center">
                <p className="text-[10px] text-[#85827d] font-medium">Profit per hour</p>
                <div className="flex items-center justify-center space-x-1">
                  <Image src={dollarCoin} alt="Dollar Coin" className="w-[18px] h-[18px]" />
                  <p className="text-sm">{"0.00"}</p>
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