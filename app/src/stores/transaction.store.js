import { create } from 'zustand';

const useTransactionStore = create((set, get) => ({
  transactions: [],
  setTransactions: (transactions) => set(() => ({ transactions })),
  userTransactions: [],
  setUserTransactions: (userTransactions) => set(() => ({ userTransactions })),
  page: 0,
  setPage: (page) => set(() => ({ page })),
  limit: 20,
  setLimit: (limit) => set(() => ({ limit })),
}));

export default useTransactionStore;
