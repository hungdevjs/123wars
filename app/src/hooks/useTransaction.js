import { useEffect } from 'react';
import { onSnapshot, collection, where, query, orderBy } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useTransactionStore from '../stores/transaction.store';
import useWallet from './useWallet';

const limit = 30;

const useTransaction = () => {
  const { wallet } = useWallet();
  const transactions = useTransactionStore((state) => state.transactions);
  const page = useTransactionStore((state) => state.page);
  const totalPages = useTransactionStore((state) => state.totalPages);
  const setTransactions = useTransactionStore((state) => state.setTransactions);
  const setPage = useTransactionStore((state) => state.setPage);
  const setTotalPages = useTransactionStore((state) => state.setTotalPages);

  const back = () => setPage(Math.max(0, page - 1));
  const next = () => setPage(Math.min(totalPages - 1, page + 1));

  useEffect(() => {
    let unsubscribe;
    if (wallet?.address) {
      const q = query(
        collection(firestore, 'transactions'),
        where('userId', '==', wallet.address.toLowerCase()),
        orderBy('createdAt', 'desc')
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        setTransactions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setTotalPages(Math.ceil(snapshot.size / limit));
      });
    } else {
      setTransactions([]);
    }

    return () => unsubscribe?.();
  }, [wallet?.address]);

  return { transactions, page, limit, totalPages, back, next };
};

export default useTransaction;
