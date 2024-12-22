import { create } from 'zustand';

const useSystemStore = create((set, get) => ({
  activeRound: null,
  setActiveRound: (activeRound) => set(() => ({ activeRound })),
  system: null,
  setSystem: (system) => set(() => ({ system })),
  winners: { rock: 0, paper: 0, scissors: 0 },
  setWinners: (winners) => set(() => ({ winners })),
}));

export default useSystemStore;
