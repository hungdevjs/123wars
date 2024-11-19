import { useEffect } from 'react';
import { onSnapshot, collection, orderBy, limit, query } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useMatchStore from '../stores/match.store';

const useMatch = () => {
  const matches = useMatchStore((state) => state.matches);
  const setMatches = useMatchStore((state) => state.setMatches);

  useEffect(() => {
    const q = query(collection(firestore, 'matches'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMatches(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe?.();
  }, []);

  return { matches };
};

export default useMatch;
