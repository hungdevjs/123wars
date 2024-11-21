import { thirdwebAuth } from '../configs/thirdweb.config.js';

export const generateLoginPayload = async ({ address, chainId }) => {
  const payload = await thirdwebAuth.generatePayload({
    address,
    chainId: chainId ? parseInt(chainId) : undefined,
  });

  return payload;
};

export const validateLoginPayload = async (data) => {
  console.log({ data });
  const verifiedPayload = await thirdwebAuth.verifyPayload(data);

  if (!verifiedPayload.valid) throw new Error('Invalid payload');

  // TODO: create user record here
  const userId = data.payload.address.toLowerCase();

  const token = await thirdwebAuth.generateJWT({
    payload: verifiedPayload.payload,
  });

  return token;
};
