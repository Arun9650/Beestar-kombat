import {create} from 'zustand';

interface User {
  id: string;
  name: string | null;
  chatId: string;
  taps: number;
  points: number;
  profit: number;
  lastProfitDate: number | null;
  rechargeLimit: number;
  pointPerTap: number;
  profitPerHour: number;
  refillRate: number;
  bonus: number;
  active: boolean;
  skin: string;
  lastLogin: Date;
  league: string | null;
  referralCount: number;
  loginStreak: number;
  referredById?: string | null;
  referrals?: User[]; // This is a self-referencing relation
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

 
}));
