import { useEffect } from 'react';

import useUserStore from '../stores/user.store';
import useTransactionStore from '../stores/transaction.store';

const useResetData = () => {
  const initialized = useUserStore((state) => state.initialized);
  const user = useUserStore((state) => state.user);
  const setUserTransactions = useTransactionStore((state) => state.setUserTransactions);
  const setPage = useTransactionStore((state) => state.setPage);

  useEffect(() => {
    if (initialized && !user) {
      setUserTransactions([]);
      setPage(0);
    }
  }, [initialized, user]);
};

export default useResetData;
