import { StaticImageData } from 'next/image';
import {create} from 'zustand';
import { binanceLogo } from '../../public/newImages';

export type TExchange = {
  name: string;
  icon: StaticImageData;
};

type ExchangeState = {
  exchange: TExchange | null;
  setExchange: (exchange: TExchange) => void;
};

const useExchangeStore = create<ExchangeState>((set) => ({
  exchange: { name: 'Binance', icon: binanceLogo },
  setExchange: (exchange) => set({ exchange }),
}));

export default useExchangeStore;
