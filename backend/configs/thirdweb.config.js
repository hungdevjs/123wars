import { createThirdwebClient } from 'thirdweb';
import { createAuth } from 'thirdweb/auth';
import { privateKeyToAccount } from 'thirdweb/wallets';

import environments from '../utils/environments.js';

const { CLIENT_DOMAIN, THIRD_WEB_SECRET_KEY, ADMIN_PRIVATE_KEY } = environments;

export const thirdwebClient = createThirdwebClient({
  secretKey: THIRD_WEB_SECRET_KEY,
});

export const thirdwebAuth = createAuth({
  domain: CLIENT_DOMAIN,
  client: thirdwebClient,
  adminAccount: privateKeyToAccount({
    client: thirdwebClient,
    privateKey: ADMIN_PRIVATE_KEY,
  }),
});
