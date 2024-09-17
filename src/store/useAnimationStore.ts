// store/useAnimationStore.ts
import {create} from 'zustand';

interface AnimationState {
  animationFinished: boolean;
  setAnimationFinished: (value: boolean) => void;
}

const useAnimationStore = create<AnimationState>((set) => ({
  animationFinished: false, // Initial state
  setAnimationFinished: (value: boolean) => set({ animationFinished: value }), // Action to update the state
}));

export default useAnimationStore;