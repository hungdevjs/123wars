import { useEffect } from 'react';
import { getContract, prepareContractCall, toWei, toEther } from 'thirdweb';
import { useSendTransaction, useReadContract } from 'thirdweb/react';

import War from '../assets/abis/War.json';
import Pitcoin from '../assets/abis/Pitcoin.json';
import { chain, client } from '../configs/thirdweb.config';
import useWallet from './useWallet';
import { delay } from '../utils/functions';
import environments from '../utils/environments';

const { GAME_ADDRESS, TOKEN_ADDRESS } = environments;

const tokenContract = getContract({
  address: TOKEN_ADDRESS,
  abi: Pitcoin.abi,
  chain,
  client,
});

const gameContract = getContract({
  address: GAME_ADDRESS,
  abi: War.abi,
  chain,
  client,
});

const useWar = () => {
  const { wallet } = useWallet();
  const { mutateAsync } = useSendTransaction();
  const { data, isLoading, refetch } = useReadContract({
    contract: tokenContract,
    method: 'allowance',
    params: [wallet?.address, GAME_ADDRESS],
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
        params: [GAME_ADDRESS, toWei('1000000000')],
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
