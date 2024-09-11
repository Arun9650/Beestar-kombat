import { StaticImageData } from 'next/image';
import {create} from 'zustand';
import { binanceLogo, bingx,  crypto, htx, kucoin, okx, huobi, coinbase } from '../../public/newImages';

export type TExchange = {
  name: string;
  icon: StaticImageData;
};



type ExchangeState = {
  exchange: TExchange ;
  exchanges: TExchange[];
  setExchange: (exchange: TExchange) => void;
};


const initialExchanges: TExchange[] = [
  { name: 'Binance', icon: binanceLogo },
  { name: 'OKX', icon: okx },
  { name: 'BingX', icon: bingx },
  { name: 'Kucoin', icon: kucoin },
  { name: 'Huobi', icon: huobi },
  { name: 'CoinBase', icon: coinbase },
];


const useExchangeStore = create<ExchangeState>((set) => ({
  exchange: { name: 'Binance', icon: binanceLogo },
  exchanges: initialExchanges, // Initialize with an empty array or populate with initial data
  setExchange: (exchange) => set({ exchange }),
}));

export default useExchangeStore;
