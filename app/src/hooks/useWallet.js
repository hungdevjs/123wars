import { useEffect } from 'react';
import { useActiveWallet, useAutoConnect } from 'thirdweb/react';

import { client } from '../configs/thirdweb.config';
import useUserStore from '../stores/user.store';

const useWallet = () => {
  const { isLoading, isFetching } = useAutoConnect({ client });
  const activeWallet = useActiveWallet();
  const setUser = useUserStore((state) => state.setUser);

  const wallet = activeWallet?.getAccount();
  const loading = isLoading || isFetching;

  useEffect(() => {
    if (!loading && !wallet) {
      setUser(null);
    }
  }, [loading, wallet]);

  return { activeWallet, wallet, loading };
};

export default useWallet;
