import { create } from 'zustand';

const useTransactionStore = create((set, get) => ({
  transactions: [],
  page: 0,
  totalPages: 1,
  setTransactions: (transactions) => set(() => ({ transactions })),
  setPage: (page) => set(() => ({ page })),
  setTotalPages: (totalPages) => set(() => ({ totalPages })),
}));

export default useTransactionStore;
