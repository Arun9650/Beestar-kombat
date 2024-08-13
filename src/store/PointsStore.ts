
import { create } from "zustand";
import { useBoostersStore } from "./useBoostrsStore";

type Points = {
  points: number;
  addPoints: (count?: number) => void;
  reducePoints: (count?: number) => void;
  nextBenchmark: number;
  currentTapsLeft: number;
  decreaseTapsLeft: (count?: number) => void;
  increaseTapsLeft: (count?: number) => void;
  skin: string | null;
  setSkin: (image: string) => void;
  lastTap: number;
  tapInBoostMode: (count: number) => void;
  initializePoints: (initial: number) => void;
  initializePPH: (initial: number )=> void;
  tapLimit: number;
  PPH: number;
  setPPH: (count: number) => void;
  setPoints : (count: number) => void
  setCurrentTapsLeft: (newTapsLeft: number) => void
  userId : string
  setUserId : (userId: string) => void
};

export const usePointsStore = create<Points>((set, get) => ({
  points: 0,
  nextBenchmark: 1000,
  currentTapsLeft: useBoostersStore.getState().energyCapacity,
  lastTap: 0,
  skin: "/newImages/BeeMain.png",
  tapLimit: useBoostersStore.getState().energyCapacity,
  PPH: 0,
  userId: "",
  setUserId: (userId) => {
    set({ userId: userId });
  },
  setCurrentTapsLeft: (newTapsLeft: number) => {
    set({ currentTapsLeft: newTapsLeft });
  },
  
  addPoints: (count) => {
    const { points } = get();

    count = count ? count : 1;

    set({ points: points + count, lastTap: Date.now() }); // Update lastTap
  },
  reducePoints: (count) => {
    const { points } = get();
    count = count ? count : 1;

    set({ points: points - count });
  },
  decreaseTapsLeft: (count) => {
    count = count ? count : 1;
    const { currentTapsLeft } = get();
    currentTapsLeft > 0 && set({ currentTapsLeft: currentTapsLeft - count });
  },
  increaseTapsLeft: (count) => {
    count = count ? count : 1;
    const { currentTapsLeft, tapLimit } = get();
    currentTapsLeft < tapLimit &&
      set({ currentTapsLeft: currentTapsLeft + count });
  },
  setSkin: (image) => {
    set({ skin: image });
  },
  tapInBoostMode: (count) => {
    const { points } = get();
    set({ points: points + count });
  },
  initializePoints: (initial) => {
    set({ points: initial });
  },

  initializePPH: (initial) => {
    set({ PPH: initial });
  },

  setPoints: (count) => {
    set({ points: count });
  },
  setPPH: (count) => {  
    set({ PPH: count });
  }

}));

// Subscribe to energyCapacity changes in useBoostersStore
useBoostersStore.subscribe((newState) => {
  usePointsStore.setState({ tapLimit: newState.energyCapacity , currentTapsLeft: newState.energyCapacity });
});