import { useEffect } from 'react';
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useUserStore from '../stores/user.store';
import useTransactionStore from '../stores/transaction.store';

const useUserTransaction = () => {
  const user = useUserStore((state) => state.user);
  const userTransactions = useTransactionStore((state) => state.userTransactions);
  const setUserTransactions = useTransactionStore((state) => state.setUserTransactions);
  const page = useTransactionStore((state) => state.page);
  const setPage = useTransactionStore((state) => state.setPage);
  const limit = useTransactionStore((state) => state.limit);
  const setLimit = useTransactionStore((state) => state.setLimit);

  const start = page * limit;
  const end = (page + 1) * limit;
  const transactions = userTransactions.slice(start, end);
  const totalPages = Math.ceil(userTransactions.length / limit);

  useEffect(() => {
    const q = query(
      collection(firestore, 'transactions'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserTransactions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  return { transactions, page, setPage, limit, setLimit, totalPages };
};

export default useUserTransaction;
