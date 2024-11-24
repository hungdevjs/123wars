import { create } from 'zustand';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useUserStore from './user.store';

const bgColors = [
  'bg-slate-200',
  'bg-green-200',
  'bg-indigo-200',
  'bg-orange-200',
];

const usePlanStore = create((set, get) => ({
  userPlan: null,
  plans: [],
  setPlans: (plans) => set(() => ({ plans })),
  fetch: async () => {
    const userId = useUserStore.getState().user?.id;
    if (!userId) return;

    try {
      const docRef = doc(firestore, 'user-plans', userId);
      const userSnapshot = await getDoc(docRef);
      const { trialUsed, plan, startTime, expireTime } = userSnapshot.data();
      const userPlan = { plan, startTime, expireTime };

      const planSnapshot = await getDocs(collection(firestore, 'plans'));
      const plans = planSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((plan) => !trialUsed || !!plan.priceInEth)
        .sort((plan1, plan2) => plan1.priceInEth - plan2.priceInEth)
        .map((plan, index) => ({ ...plan, bg: bgColors[index] }));
      set(() => ({ plans, userPlan }));
    } catch (err) {
      console.error(err);
    }
  },
}));

export default usePlanStore;
