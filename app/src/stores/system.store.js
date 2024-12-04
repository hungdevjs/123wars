import { create } from 'zustand';

const useSystemStore = create((set, get) => ({
  activeRound: null,
  setActiveRound: (activeRound) => set(() => ({ activeRound })),
  activeReward: null,
  setActiveReward: (activeReward) => set(() => ({ activeReward })),
}));

export default useSystemStore;
