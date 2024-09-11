"use client";
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'

import { useRouter, useSearchParams } from 'next/navigation';

const Booster = () => {


  const router = useRouter();
  const search = useSearchParams();
  const id = search.get("id");


  const handleRoute = () => {
    router.push(`/booster?id=${id}`);
  };



  return (
    <div className='flex items-center'>
        {/* <Button className='flex items-center gap-2 p-5'> 
        <Image src="/newImages/tap.png" alt="" width={20} height={20} className="" /> 
            
            Tap Bee</Button> */}
        <button onClick={() => handleRoute() } className='flex items-center gap-4 boost-button h-10 px-5 py-2 rounded-3xl border-2 border-[#FCEE21]'>
        <Image src="/newImages/rocket.png" alt="" width={20} height={20} className="rotate-12" />            
            Boost</button>
    </div>
  )
}

export default Booster