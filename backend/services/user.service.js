import { formatEther } from '@ethersproject/units';

import admin, { firestore } from '../configs/firebase.config.js';
import { getUserDetail } from './api.service.js';
import quickNode from '../configs/quicknode.config.js';
import { decodeGameTxnLogs } from './contract.service.js';
import { date } from '../utils/strings.js';
import environments from '../utils/environments.js';

const { GAME_ADDRESS } = environments;

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

export const validateGameTransaction = async ({ transactionHash }) => {
  console.log(`========== validateGameTransaction at ${date()}, transactionHash ${transactionHash} ==========`);
  const txRef = firestore.collection('transactions').doc(transactionHash);
  await firestore.runTransaction(async (transaction) => {
    const tx = await transaction.get(txRef);
    if (tx.exists) {
      console.log(
        `========== CANCEL validateGameTransaction, transaction ${transactionHash} is already processed ==========`
      );
      return;
    }

    const receipt = await quickNode.waitForTransaction(transactionHash);
    const { to, status, logs } = receipt;
    if (status !== 1) throw new Error('API error: Invalid txn status');
    if (to.toLowerCase() !== GAME_ADDRESS.toLowerCase()) throw new Error('API error: Bad credential');

    const decodedData = decodeGameTxnLogs('BetCreated', logs[logs.length - 1]);
    const { roundId, option, from, value } = decodedData;

    const options = {
      1: 'rock',
      2: 'paper',
      3: 'scissors',
    };

    const userOption = options[option.toString()];
    const userValue = Number(formatEther(`${value}`));

    const userRef = firestore.collection('users').where('address', '==', from.toLowerCase()).limit(1);
    const user = await transaction.get(userRef);
    if (!user.empty) {
      transaction.set(txRef, {
        userId: user.docs[0].id,
        address: from.toLowerCase(),
        type: 'bet',
        roundId: roundId.toString(),
        option: userOption,
        value: userValue,
        transactionHash,
        status: 'success',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    const roundRef = firestore.collection('rounds').doc(roundId.toString());
    const countKey = `bettings.${userOption}.count`;
    const valueKey = `bettings.${userOption}.value`;
    transaction.update(roundRef, {
      [countKey]: admin.firestore.FieldValue.increment(1),
      [valueKey]: admin.firestore.FieldValue.increment(userValue),
    });
  });

  console.log(`========== SUCCESS validateGameTransaction at ${date()}, transactionHash ${transactionHash} ==========`);
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
