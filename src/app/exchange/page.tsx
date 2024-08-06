'use client'

// pages/exchange.js
import React, { useState } from 'react';
import { SlArrowRight } from 'react-icons/sl';
import { binanceLogo, bingx, bybit, crypto, htx, kucoin, okx } from '../../../public/newImages';
import Image from 'next/image';
import useExchangeStore, { TExchange } from '@/store/useExchangeStore';

const exchanges = [
  { name: 'Binance', icon: binanceLogo },
  { name: 'OKX', icon: okx },
  { name: 'Crypto.com', icon: crypto },
  { name: 'Bybit', icon: bybit },
  { name: 'BingX', icon: bingx },
  { name: 'HTX', icon: htx },
  { name: 'Kucoin', icon: kucoin },
];

const Exchange = () => {
  const { exchange, setExchange } = useExchangeStore();
  const [selectedExchange, setSelectedExchange] = useState(exchange);
  const handleSelect = (exchange: TExchange) => {
    setExchange(exchange);
    setSelectedExchange(exchange);
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4  ">
        <h1 className="text-lg mx-auto  w-fit font-bold">Choose exchange</h1>
      </header>
      <main className="p-4 space-y-2">
        {exchanges.map((exchange) => (
          <div onClick={() => handleSelect(exchange)} key={exchange.name} className="flex items-center bg-[#1d2025] p-4 rounded-2xl">
            <Image src={exchange.icon} alt={`${exchange.name} icon`} className="w-6 h-6 mr-4" />
            <span className="flex-1">{exchange.name}</span>
            <span className="text-gray-400"> 
                <SlArrowRight className='text-gray-400' />
                 </span>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Exchange;
