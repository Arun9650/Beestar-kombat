// pages/exchange.js
import React from 'react';
import { SlArrowRight } from 'react-icons/sl';

const exchanges = [
  { name: 'Binance', icon: '/binance-icon.png' },
  { name: 'OKX', icon: '/okx-icon.png' },
  { name: 'Crypto.com', icon: '/crypto-icon.png' },
  { name: 'Bybit', icon: '/bybit-icon.png' },
  { name: 'BingX', icon: '/bingx-icon.png' },
  { name: 'HTX', icon: '/htx-icon.png' },
  { name: 'Kucoin', icon: '/kucoin-icon.png' },
  { name: 'Gate.io', icon: '/gateio-icon.png' },
];

const Exchange = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4  ">
        <h1 className="text-lg mx-auto  w-fit font-bold">Choose exchange</h1>
      </header>
      <main className="p-4 space-y-2">
        {exchanges.map((exchange) => (
          <div key={exchange.name} className="flex items-center bg-[#1d2025] p-4 rounded-2xl">
            <img src={exchange.icon} alt={`${exchange.name} icon`} className="w-6 h-6 mr-4" />
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
