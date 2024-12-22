import { ConnectButton } from 'thirdweb/react';

import { client, wallets, chain } from '../configs/thirdweb.config';
import { getLoginPayload as getLoginPayloadAPI, validateLoginPayload } from '../services/auth.service';
import { getMe } from '../services/user.service';
import { saveToken, removeToken } from '../utils/storage';
import useUserStore from '../stores/user.store';
import environments from '../utils/environments';

const { TOKEN_ADDRESS } = environments;

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
  const res = await getMe();
  useUserStore.getState().setUser(res.data);
  return true;
};

const doLogout = () => {
  removeToken();
  useUserStore.getState().setUser(null);
};

const ConnectWalletButton = ({ buttonStyle = {} }) => {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      chain={chain}
      connectModal={{
        size: 'compact',
        title: 'Login',
        showThirdwebBranding: false,
      }}
      auth={{
        getLoginPayload,
        doLogin,
        isLoggedIn,
        doLogout,
      }}
      theme="dark"
      connectButton={{
        label: 'Sign in',
        style: { ...buttonStyle },
      }}
      detailsButton={{
        style: { ...buttonStyle },
      }}
    />
  );
};

export default ConnectWalletButton;
