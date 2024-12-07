import { ConnectButton } from "thirdweb/react";

import { client, wallets, chain } from "../configs/thirdweb.config";
import {
  getLoginPayload as getLoginPayloadAPI,
  validateLoginPayload,
} from "../services/auth.service";
import { getMe } from "../services/user.service";
import { saveToken, removeToken } from "../utils/storage";
import useUserStore from "../stores/user.store";

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

const doLogout = () => removeToken();

const ConnectWalletButton = () => {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      chain={chain}
      connectModal={{
        size: "compact",
        title: "Login",
        showThirdwebBranding: false,
      }}
      auth={{
        getLoginPayload,
        doLogin,
        isLoggedIn,
        doLogout,
      }}
      theme="light"
      connectButton={{
        label: "Sign in",
        style: { borderRadius: "40px" },
      }}
      supportedTokens={["0x9D6aB093065f9514664B6000e5e3344a1230F202"]}
      detailsButton={{
        displayBalanceToken: {
          [chain.id]: "0x9D6aB093065f9514664B6000e5e3344a1230F202",
        },
        style: { borderRadius: "40px" },
      }}
    />
  );
};

export default ConnectWalletButton;
