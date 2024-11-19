import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  accessToken: null,
  expireTime: null,
  setAccessToken: ({ accessToken, expireTime }) => set(() => ({ accessToken, expireTime })),
}));

export default useAuthStore;
