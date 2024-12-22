import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, limit, orderBy } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';

const useRound = () => {
  const [rounds, setRounds] = useState([]);

  const recentWinners = rounds.map((round) => round.winner);

  useEffect(() => {
    const q = query(collection(firestore, 'rounds'), orderBy('endedAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRounds(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  return { recentWinners };
};

export default useRound;
