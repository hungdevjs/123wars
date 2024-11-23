import admin, { firestore } from '../configs/firebase.config.js';

export const createUserIfNotExist = async (data) => {
  const { userId, address, email, name, avatar } = data;
  const userRef = firestore.collection('users').doc(address);
  const pointRef = firestore.collection('points').doc(address);
  const activityRef = firestore.collection('activities').doc();

  await firestore.runTransaction(async (transaction) => {
    const user = await transaction.get(userRef);

    if (user.exists) return;

    transaction.set(userRef, {
      externalId: userId,
      address,
      email,
      name,
      avatar,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    transaction.set(pointRef, { point: 0 });
    transaction.set(activityRef, {
      user: { userId: address, name, email, avatar },
      type: 'new-account',
      metadata: {},
    });
  });

  return data;
};
