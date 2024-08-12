import { create } from "zustand";

export type BoostersStore = {
  refill: number;
  tapCommando: number;
  secondsLeft: number;

  decreaseRefill: () => void;
  decreaseTapCommando: () => void;
  decreaseSecondsLeft: () => void;
  setSecondsLeft: (val: number) => void;
  setRefill: (refill: number) => void; // Add setRefill here

  //   one time boosts
  energyCapacity: number;
  rechargeVelocity: number;
  multiClickLevel: number;

  setEnergyCapacity: (val: number) => void;
  setRechargeVelocity: (vl: number) => void;
  setMultiClickLevel: (val: number) => void;

  
};

export const useBoostersStore = create<BoostersStore>((set, get) => ({
  refill: 6,
  tapCommando: 3,
  secondsLeft: 0,

  decreaseRefill: () => {
    const { refill } = get();
    refill > 0 && set({ refill: refill - 1 });
  },
  decreaseTapCommando: () => {
    const { tapCommando } = get();
    set({ tapCommando: tapCommando - 1 });
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
  rechargeVelocity: 1,

  setMultiClickLevel: (val) => set({ multiClickLevel: val }),
  setRechargeVelocity: (val) => set({ rechargeVelocity: val }),
  setEnergyCapacity: (val) => set({ energyCapacity: val }),
  setRefill: (refill) => set({ refill }), // Define setRefill

}));
