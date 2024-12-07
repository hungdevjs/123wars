import { create } from "zustand";

const useSystemStore = create((set, get) => ({
  activeRound: null,
  setActiveRound: (activeRound) => set(() => ({ activeRound })),
  system: null,
  setSystem: (system) => set(() => ({ system })),
}));

export default useSystemStore;
