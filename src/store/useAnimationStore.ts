// store/useAnimationStore.ts
import { create } from 'zustand';

interface AnimationState {
	 animationFinished: boolean;          // To track whether the animation has finished
  purchaseCompleteAnimation: boolean;           // To track whether the purchase is complete
  setAnimationFinished: (value: boolean) => void; // Action to update the animation state
  setPurchaseCompleteAnimation: (value: boolean) => void;  // Action to update the purchase state

  animationAlert: boolean
  setAnimationAlert: (value: boolean) => void
}

const useAnimationStore = create<AnimationState>((set) => ({
  animationAlert: true,
  animationFinished: false, // Initial animation state
  purchaseCompleteAnimation: false,  // Initial purchase state
  setAnimationAlert: (value: boolean) => set({ animationAlert: value }),
  setAnimationFinished: (value: boolean) => set({ animationFinished: value }), // Action to update the animation state
  setPurchaseCompleteAnimation: (value: boolean) => set({ purchaseCompleteAnimation: value }),   // Action to update the purchase state
}));

export default useAnimationStore;
