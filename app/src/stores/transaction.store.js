import { create } from 'zustand';

const useTransactionStore = create((set, get) => ({
  userTransactions: [],
  setUserTransactions: (userTransactions) => set(() => ({ userTransactions })),
  page: 0,
  setPage: (page) => set(() => ({ page })),
  limit: 15,
  setLimit: (limit) => set(() => ({ limit })),
}));

export default useTransactionStore;
