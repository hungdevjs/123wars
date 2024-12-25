import admin, { firestore } from '../configs/firebase.config.js';
import { getUserDetail } from './api.service.js';

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

export const validatePhoneNumber = async ({ userId }) => {
  const user = await firestore.collection('users').doc(userId).get();
  const { phone } = user.data();
  if (phone) return;

  const res = await getUserDetail(userId);
  const userData = res.data[0];
  const { linkedAccounts } = userData;

  const phoneAccount = linkedAccounts.find((account) => account.type === 'phone');
  if (!phoneAccount) throw new Error('API error: Bad request');

  const { details } = phoneAccount;
  await firestore.collection('users').doc(userId).update({ phone: details.phone });

  return details.phone;
};

export const getMe = async (userId) => {
  const user = await firestore.collection('users').doc(userId).get();

  return { id: user.id, ...user.data() };
};

export const checkReward = async ({ userId }) => {
  const systemRef = firestore.collection('system').doc('main');
  await firestore.runTransaction(async (transaction) => {
    const system = await transaction.get(systemRef);
    const { lastWinner } = system.data();

    if (lastWinner?.userId !== userId) throw new Error('API error: Bad credential');
    transaction.update(systemRef, { 'lastWinner.checked': true });
  });
};
