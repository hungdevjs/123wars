import { useEffect } from 'react';
import { onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';

import { firestore } from '../../../configs/firebase.config';
import useTransactionStore from '../../../stores/transaction.store';

const useTransaction = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const setTransactions = useTransactionStore((state) => state.setTransactions);

  useEffect(() => {
    const q = query(collection(firestore, 'transactions'), orderBy('createdAt', 'desc'), limit(200));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  return { transactions };
};

export default useTransaction;
