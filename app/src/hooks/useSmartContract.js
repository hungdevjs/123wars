import { formatBytes32String } from '@ethersproject/strings';
import { getContract, prepareContractCall, toWei } from 'thirdweb';
import { useSendTransaction } from 'thirdweb/react';

import Game from '../assets/abis/Game.json';
import { chain, client } from '../configs/thirdweb.config';
import environments from '../utils/environments';

const { GAME_ADDRESS } = environments;

const gameContract = getContract({
  address: GAME_ADDRESS,
  abi: Game.abi,
  chain,
  client,
});

const useSmartContract = () => {
  const { mutateAsync } = useSendTransaction();

  const subscribe = async (plan) => {
    const { id, priceInEth } = plan;
    const planId = formatBytes32String(id);

    const transaction = prepareContractCall({
      contract: gameContract,
      method: 'subscribe',
      params: [planId],
      value: toWei(`${priceInEth}`),
    });

    const tx = await mutateAsync(transaction);

    return tx.transactionHash;
  };

  return { subscribe };
};

export default useSmartContract;
