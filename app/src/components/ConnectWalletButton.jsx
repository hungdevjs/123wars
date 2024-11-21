import { ConnectButton } from 'thirdweb/react';

import { client, wallets, chain } from '../configs/thirdweb.config';
import {
  getLoginPayload as getLoginPayloadAPI,
  validateLoginPayload,
  validateToken,
} from '../services/auth.service';
import { saveToken, removeToken } from '../utils/storage';

const getLoginPayload = async (params) => {
  const res = await getLoginPayloadAPI({
    address: params.address,
    chainId: chain.id,
  });

  return res.data;
};

const doLogin = async (params) => {
  const res = await validateLoginPayload(params);
  saveToken(res.data);
};

const isLoggedIn = async () => {
  await validateToken();
  return true;
};

const doLogout = () => removeToken();

const ConnectWalletButton = () => {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      chain={chain}
      theme="light"
      auth={{
        getLoginPayload,
        doLogin,
        isLoggedIn,
        doLogout,
      }}
    />
  );
};

export default ConnectWalletButton;
