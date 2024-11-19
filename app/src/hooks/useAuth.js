import { useEffect, useRef } from 'react';

import useWallet from './useWallet';
import useAuthStore from '../stores/auth.store';
import { getWalletMessage } from '../services/wallet.service';
import { init } from '../services/user.service';

const useAuth = () => {
  const interval = useRef();
  const { wallet, loading } = useWallet();
  const accessToken = useAuthStore((state) => state.accessToken);
  const expireTime = useAuthStore((state) => state.expireTime);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const fetchAuth = async () => {
    if (!wallet) return;
    const now = Date.now();
    if (accessToken && expireTime && expireTime - 10 * 60 * 1000 > now) return;
    try {
      const res = await getWalletMessage({ address: wallet.address });
      const { message } = res.data;

      const signature = await wallet.signMessage({ message });
      const { data } = await init({ message, signature });
      setAccessToken({ accessToken: data.token, expireTime: data.expireTime });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAuth();

    interval.current = setInterval(fetchAuth, 5 * 60 * 1000);

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [wallet]);

  return { loading };
};

export default useAuth;
