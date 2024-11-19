import { ConnectButton } from 'thirdweb/react';

import { client, wallets, chain } from '../configs/thirdweb.config';

const ConnectWalletButton = () => {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      chain={chain}
      theme="light"
    />
  );
};

export default ConnectWalletButton;
