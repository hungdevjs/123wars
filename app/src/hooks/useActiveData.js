import { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useSystemStore from '../stores/system.store';

const useActiveData = () => {
  const activeRound = useSystemStore((state) => state.activeRound);
  const setActiveRound = useSystemStore((state) => state.setActiveRound);
  const setActiveReward = useSystemStore((state) => state.setActiveReward);

  const [activeRoundId, setActiveRoundId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, 'system', 'main'),
      (snapshot) => {
        setActiveRoundId(snapshot.data().activeRoundId);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (activeRoundId) {
      unsubscribe = onSnapshot(
        doc(firestore, 'rounds', activeRoundId),
        (snapshot) => {
          setActiveRound({ id: activeRoundId, ...snapshot.data() });
        }
      );
    } else {
      setActiveRound(null);
    }

    return () => unsubscribe?.();
  }, [activeRoundId]);

  useEffect(() => {
    let unsubscribe;
    if (activeRound?.activeRewardId) {
      unsubscribe = onSnapshot(
        doc(firestore, 'rewards', activeRound.activeRewardId),
        (snapshot) => {
          setActiveReward({
            id: activeRound.activeRewardId,
            ...snapshot.data(),
          });
        }
      );
    } else {
      setActiveReward(null);
    }

    return () => unsubscribe?.();
  }, [activeRound?.activeRewardId]);
};

export default useActiveData;
