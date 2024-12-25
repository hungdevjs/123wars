import { useEffect } from 'react';
import { getContract, prepareContractCall, toWei, toEther } from 'thirdweb';
import { useSendTransaction, useReadContract } from 'thirdweb/react';

import War from '../assets/abis/War.json';
import Pitcoin from '../assets/abis/Pitcoin.json';
import { chain, client } from '../configs/thirdweb.config';
import useWallet from './useWallet';
import useSystemStore from '../stores/system.store';
import { delay } from '../utils/functions';

const useWar = () => {
  const system = useSystemStore((state) => state.system);
  const { addresses } = system || {};
  const { wallet } = useWallet();
  const { mutateAsync } = useSendTransaction();

  const tokenContract = getContract({
    address: addresses.token,
    abi: Pitcoin.abi,
    chain,
    client,
  });

  const gameContract = getContract({
    address: addresses.game,
    abi: War.abi,
    chain,
    client,
  });

  const { data, isLoading, refetch } = useReadContract({
    contract: tokenContract,
    method: 'allowance',
    params: [wallet?.address, addresses.game],
  });

  useEffect(() => {
    if (wallet) {
      refetch();
    }
  }, [wallet]);

  const approvedTokenAmount = data ? toEther(data) : 0;

  const bet = async ({ roundId, value, option, time, signature }) => {
    if (isLoading) return;

    if (!value) throw new Error('Invalid amount');
    if (value > approvedTokenAmount) {
      const approveTransaction = prepareContractCall({
        contract: tokenContract,
        method: 'approve',
        params: [addresses.game, toWei('1000000000')],
      });

      await mutateAsync(approveTransaction);
      await delay(1000);
      refetch();
    }

    const transaction = prepareContractCall({
      contract: gameContract,
      method: 'bet',
      params: [roundId, option, toWei(`${value}`), time, signature],
    });

    const tx = await mutateAsync(transaction);

    return tx.transactionHash;
  };

  return { bet };
};

export default useWar;
