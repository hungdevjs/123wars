import { useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useUserStore from '../stores/user.store';
import useWallet from './useWallet';

const useUser = () => {
  const { wallet } = useWallet();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    let unsubscribe;
    if (wallet?.address) {
      unsubscribe = onSnapshot(doc(firestore, 'users', wallet?.address?.toLowerCase()), (snapshot) => {
        if (snapshot.exists()) {
          setUser({ id: snapshot.id, ...snapshot.data() });
        } else {
          setUser(null);
        }
      });
    } else {
      setUser(null);
    }

    return () => unsubscribe?.();
  }, [wallet?.address]);

  return { user };
};

export default useUser;
