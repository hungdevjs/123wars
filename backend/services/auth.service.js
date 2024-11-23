import { firestore } from '../configs/firebase.config.js';
import { thirdwebAuth } from '../configs/thirdweb.config.js';
import { getUserDetail } from './api.service.js';
import { createUserIfNotExist } from './user.service.js';

export const generateLoginPayload = async ({ address, chainId }) => {
  const payload = await thirdwebAuth.generatePayload({
    address,
    chainId: chainId ? parseInt(chainId) : undefined,
  });

  return payload;
};

export const validateLoginPayload = async (data) => {
  const verifiedPayload = await thirdwebAuth.verifyPayload(data);

  if (!verifiedPayload.valid) throw new Error('Invalid payload');

  // TODO: handle multiple login method here
  const res = await getUserDetail(data.payload.address);
  const user = res.data[0];

  const { userId, walletAddress, email, linkedAccounts } = user;
  const { name, picture } = linkedAccounts[0]?.details;
  await createUserIfNotExist({
    userId,
    address: walletAddress.toLowerCase(),
    email,
    name,
    avatar: picture,
  });

  const token = await thirdwebAuth.generateJWT({
    payload: verifiedPayload.payload,
  });

  return token;
};

export const getMe = async (userId) => {
  const user = await firestore.collection('users').doc(userId).get();

  return { id: user.id, ...user.data() };
};
