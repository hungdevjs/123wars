import { useState } from 'react';
import RouterABI from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import { getContract, prepareContractCall, toWei, toEther } from 'thirdweb';
import { useSendTransaction, useReadContract } from 'thirdweb/react';
import fromExponential from 'from-exponential';

import Pitcoin from '../assets/abis/Pitcoin.json';
import { chain, client } from '../configs/thirdweb.config';
import { delay } from '../utils/functions';
import useSystemStore from '../stores/system.store';
import useWallet from './useWallet';

const useSwap = () => {
  const { wallet } = useWallet();
  const { mutateAsync } = useSendTransaction();
  const [ethIn, setEthIn] = useState(0);
  const [tokenIn, setTokenIn] = useState(0);
  const system = useSystemStore((state) => state.system);
  const { addresses } = system || {};

  const tokenContract = getContract({
    address: addresses.token,
    abi: Pitcoin.abi,
    chain,
    client,
  });

  const routerContract = getContract({
    address: addresses.router,
    abi: RouterABI.abi,
    chain,
    client,
  });

  const { data, isLoading, refetch } = useReadContract({
    contract: tokenContract,
    method: 'allowance',
    params: [wallet?.address, addresses.router],
  });

  const { data: tokenInputToEthData, isLoading: isLoadingTokenToEth } = useReadContract({
    contract: routerContract,
    method: 'getAmountsOut',
    params: [toWei(fromExponential(tokenIn)), [addresses.token, addresses.weth]],
  });

  const { data: ethInputToTokenData, isLoading: isLoadingEthToToken } = useReadContract({
    contract: routerContract,
    method: 'getAmountsOut',
    params: [toWei(fromExponential(ethIn)), [addresses.weth, addresses.token]],
  });

  const swapEthToToken = async () => {
    if (!ethIn || ethIn < 0) throw new Error('Invalid amount');
    const paths = [addresses.weth, addresses.token];
    const deadline = Math.floor(Date.now() / 1000 + 10 * 60);
    const params = [0, paths, wallet?.address, deadline];

    const transaction = prepareContractCall({
      contract: routerContract,
      method: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
      params,
      value: toWei(`${ethIn}`),
    });

    const tx = await mutateAsync(transaction);

    return tx.transactionHash;
  };

  const approvedTokenAmount = data ? Number(toEther(data)) : 0;

  const swapTokenToEth = async () => {
    if (!tokenIn || tokenIn < 0) throw new Error('Invalid amount');
    if (isLoading) return;

    if (tokenIn > approvedTokenAmount) {
      const approveTransaction = prepareContractCall({
        contract: tokenContract,
        method: 'approve',
        params: [addresses.router, toWei('1000000000')],
      });

      await mutateAsync(approveTransaction);
      await delay(3000);
      refetch();
    }

    const paths = [addresses.token, addresses.weth];
    const deadline = Math.floor(Date.now() / 1000 + 10 * 60);
    const params = [toWei(`${tokenIn}`), 0, paths, wallet?.address, deadline];

    const transaction = prepareContractCall({
      contract: routerContract,
      method: 'swapExactTokensForETHSupportingFeeOnTransferTokens',
      params,
    });

    const tx = await mutateAsync(transaction);

    return tx.transactionHash;
  };

  return {
    tokenIn,
    setTokenIn,
    ethIn,
    setEthIn,
    tokenInputToEthData,
    ethInputToTokenData,
    isLoadingTokenToEth,
    isLoadingEthToToken,
    swapEthToToken,
    swapTokenToEth,
  };
};

export default useSwap;
