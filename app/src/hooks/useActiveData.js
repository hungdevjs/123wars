import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";

import { firestore } from "../configs/firebase.config";
import useSystemStore from "../stores/system.store";

const useActiveData = () => {
  const setSystem = useSystemStore((state) => state.setSystem);
  const setActiveRound = useSystemStore((state) => state.setActiveRound);

  const [activeRoundId, setActiveRoundId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "system", "main"),
      (snapshot) => {
        setSystem({ ...snapshot.data() });
        setActiveRoundId(snapshot.data().activeRoundId);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (activeRoundId) {
      unsubscribe = onSnapshot(
        doc(firestore, "rounds", activeRoundId),
        (snapshot) => {
          setActiveRound({ id: activeRoundId, ...snapshot.data() });
        }
      );
    } else {
      setActiveRound(null);
    }

    return () => unsubscribe?.();
  }, [activeRoundId]);
};

export default useActiveData;
