import { useActiveWallet, useAutoConnect } from 'thirdweb/react';
import { client } from '../configs/thirdweb.config';

const useWallet = () => {
  const { isLoading, isFetching } = useAutoConnect({ client });
  const activeWallet = useActiveWallet();

  const wallet = activeWallet?.getAccount();
  const loading = isLoading || isFetching;

  return { activeWallet, wallet, loading };
};

export default useWallet;
