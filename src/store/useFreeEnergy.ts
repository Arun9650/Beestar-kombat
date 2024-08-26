
import { create } from "zustand";

export type FreeEnergyStore = {
    freeEnergy: number;
    
  
    decreaseFreeEnergy: () => void;
    setFreeEnergy: (refill: number) => void; // Add setRefill here
    
    
  };



export const useFreeEnergy = create<FreeEnergyStore>((set, get) => ({
    freeEnergy: 6,
  
    decreaseFreeEnergy: () => {
        const { freeEnergy } = get();
        freeEnergy > 0 && set({ freeEnergy: freeEnergy - 1 });
    },
  
    setFreeEnergy: (refill) => set({ freeEnergy: refill }), 

}));