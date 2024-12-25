import admin, { firestore } from '../configs/firebase.config.js';

export const createUserIfNotExist = async (data) => {
  const { userId, address, linkedAccounts } = data;
  const userRef = firestore.collection('users').doc(address);

  await firestore.runTransaction(async (transaction) => {
    const user = await transaction.get(userRef);

    if (user.exists) return;

    transaction.set(userRef, {
      externalId: userId,
      address,
      linkedAccounts,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  return data;
};

export const getMe = async (userId) => {
  const user = await firestore.collection('users').doc(userId).get();

  return { id: user.id, ...user.data() };
};
