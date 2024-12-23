import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, limit, orderBy, where } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useUserStore from '../stores/user.store';
import useSystemStore from '../stores/system.store';

const useRound = () => {
  const user = useUserStore((state) => state.user);
  const activeRound = useSystemStore((state) => state.activeRound);
  const [rounds, setRounds] = useState([]);
  const [roundBets, setRoundBets] = useState({ rock: 0, paper: 0, scissors: 0 });

  const recentWinners = rounds.map((round) => round.winner);

  useEffect(() => {
    const q = query(collection(firestore, 'rounds'), orderBy('endedAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRounds(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (user && activeRound) {
      const q = query(
        collection(firestore, 'transactions'),
        where('userId', '==', user.id),
        where('roundId', '==', activeRound.id)
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const bets = snapshot.docs.reduce(
          (result, doc) => {
            const { option, value } = doc.data();
            return { ...result, [option]: (result[option] || 0) + value };
          },
          { rock: 0, paper: 0, scissors: 0 }
        );

        setRoundBets(bets);
      });
    } else {
      setRoundBets({ rock: 0, paper: 0, scissors: 0 });
    }

    return () => unsubscribe?.();
  }, [user, activeRound]);

  return { recentWinners, roundBets };
};

export default useRound;
