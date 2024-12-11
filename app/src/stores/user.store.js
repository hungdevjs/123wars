import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  initialized: false,
  user: null,
  setUser: (user) => set(() => ({ user, initialized: true })),
}));

export default useUserStore;
