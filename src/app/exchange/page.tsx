'use client'

// pages/exchange.js
import React, { useState } from 'react';
import { SlArrowRight } from 'react-icons/sl';

import Image, { StaticImageData } from 'next/image';
import useExchangeStore, { TExchange } from '@/store/useExchangeStore';
import { FaCheck } from "react-icons/fa";



const Exchange = () => {
  const { exchange, setExchange , exchanges } = useExchangeStore();
  const handleSelect = (exchange: TExchange) => {
    setExchange(exchange);
    window.localStorage.setItem('exchange', exchange.name);
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4  ">
        <h1 className="text-lg mx-auto  w-fit font-bold">Choose exchange</h1>
      </header>
      <main className="p-4 space-y-2">
        {exchanges.map((item) => (
          <div onClick={() => handleSelect(item)} key={item.name} className="flex items-center bg-[#1d2025] p-4 rounded-2xl">
            <Image src={item.icon} alt={`${item.name} icon`} className="w-6 h-6 mr-4" />
            <span className="flex-1">{item.name}</span>
            <span className="text-gray-400"> 
              {
                item.name !== exchange?.name ? <SlArrowRight className='text-gray-400' /> : <FaCheck className='text-gray-400' />
              }
                 </span>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Exchange;
