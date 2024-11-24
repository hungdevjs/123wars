import { create } from 'zustand';
import { doc, getDoc } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useUserStore from './user.store';

const usePointStore = create((set, get) => ({
  point: 0,
  rank: '-',
  fetch: async () => {
    const userId = useUserStore.getState().user?.id;
    if (!userId) return;

    try {
      const docRef = doc(firestore, 'points', userId);
      const snapshot = await getDoc(docRef);
      const { point, rank } = snapshot.data();
      set(() => ({ point, rank }));
    } catch (err) {
      console.error(err);
    }
  },
}));

export default usePointStore;
