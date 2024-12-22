import { createThirdwebClient } from 'thirdweb';
import { base, baseSepolia } from 'thirdweb/chains';
import { inAppWallet } from 'thirdweb/wallets';

import environments from '../utils/environments';

const { THIRD_WEB_CLIENT_ID, VITE_ENV } = environments;

export const client = createThirdwebClient({ clientId: THIRD_WEB_CLIENT_ID });

export const wallets = [inAppWallet({})];

export const chain = VITE_ENV === 'production' ? base : baseSepolia;
