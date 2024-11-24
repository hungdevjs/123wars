import { create } from 'zustand';
import { getDocs, query, where, orderBy, collection } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useUserStore from './user.store';

const useActivityStore = create((set, get) => ({
  activities: [],
  setActivities: (activities) => set(() => ({ activities })),
  fetch: async () => {
    const userId = useUserStore.getState().user?.id;
    if (!userId) return;

    try {
      const q = query(
        collection(firestore, 'activities'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const activities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set(() => ({ activities }));
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useActivityStore;
