import { create } from "zustand";

export type BoostersStore = {
  refill: number;

  secondsLeft: number;

  decreaseRefill: () => void;
  decreaseSecondsLeft: () => void;
  setSecondsLeft: (val: number) => void;
  setRefill: (refill: number) => void; // Add setRefill here

  //   one time boosts
  energyCapacity: number;
  multiClickLevel: number;
  multiClickCost: number;

  setEnergyCapacity: (val: number) => void;
  setMultiClickLevel: (val: number) => void;
  setMultiClickCost: (val: number) => void;

  
};

export const useBoostersStore = create<BoostersStore>((set, get) => ({
  refill: 6,
  secondsLeft: 0,

  decreaseRefill: () => {
    const { refill } = get();
    refill > 0 && set({ refill: refill - 1 });
  },
 
  decreaseSecondsLeft: () => {
    const s = get().secondsLeft;
    set({ secondsLeft: s - 1 });
  },
  setSecondsLeft: (val) => {
    set({ secondsLeft: val });
  },

  //   one time boosts
  energyCapacity: 500,
  multiClickLevel: 1,
  multiClickCost: 500,

  setMultiClickLevel: (val) => set({ multiClickLevel: val }),
  setMultiClickCost:  (val) => set({ multiClickCost: val }),
  setEnergyCapacity: (val) => set({ energyCapacity: val }),
  setRefill: (refill) => set({ refill }), // Define setRefill

}));
