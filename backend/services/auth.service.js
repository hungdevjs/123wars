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

  const res = await getUserDetail(data.payload.address);
  const user = res.data[0];

  const { userId, walletAddress, linkedAccounts } = user;
  await createUserIfNotExist({
    userId,
    address: walletAddress.toLowerCase(),
    linkedAccounts,
  });

  const token = await thirdwebAuth.generateJWT({
    payload: verifiedPayload.payload,
  });

  return token;
};
