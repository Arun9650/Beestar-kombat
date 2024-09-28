// store/useAnimationStore.ts
import { create } from 'zustand';

interface AnimationState {
    isAccountCreated:boolean ;          // To track whether the animation    // To track whether the purchase is complete
  setIsAccountCreated: (value: boolean) => void; // Action to update 
}

const useAuthFix = create<AnimationState>((set) => ({
    isAccountCreated: false,
    setIsAccountCreated: (value: boolean) => set({ isAccountCreated: value }), // Action to update the animation state

}));

export default useAuthFix;
