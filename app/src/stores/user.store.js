import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}));

export default useUserStore;
