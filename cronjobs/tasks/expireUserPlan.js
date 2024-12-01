import chunk from 'lodash.chunk';

import { firestore } from '../configs/firebase.config.js';
import { retry } from '../utils/functions.js';

const expireUserPlan = async () => {
  const now = Date.now();
  const userPlans = await firestore.collection('user-plans').get();

  const allPromises = [];

  for (const doc of userPlans.docs) {
    const { expireTime } = doc.data();
    if (!expireTime) continue;

    if (expireTime.toDate().getTime() < now) {
      allPromises.push(
        doc.ref.update({
          plan: null,
          startTime: null,
          expireTime: null,
        })
      );
    }
  }

  const chunkedPromises = chunk(allPromises, 100);
  const total = chunkedPromises.length;

  for (let i = 0; i < chunkedPromises.length; i++) {
    const promises = chunkedPromises[i];
    await retry({
      name: `expireUserPlan patch ${i + 1}/${total}`,
      action: () => Promise.all(promises),
    });
  }
};

export default expireUserPlan;
