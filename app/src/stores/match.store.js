import { create } from 'zustand';

const useMatchStore = create((set, get) => ({
  matches: [],
  setMatches: (matches) => set(() => ({ matches })),
}));

export default useMatchStore;
