import { create } from 'zustand';

interface AppState {
  unlockedDays: number[];
  unlockDay: (day: number) => void;
  isBirthday: boolean;
  setIsBirthday: (isBirthday: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  unlockedDays: [],
  unlockDay: (day) => set((state) => ({
    unlockedDays: state.unlockedDays.includes(day) 
      ? state.unlockedDays 
      : [...state.unlockedDays, day]
  })),
  isBirthday: false,
  setIsBirthday: (isBirthday) => set({ isBirthday }),
}));
