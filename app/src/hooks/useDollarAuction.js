import { getContract, prepareContractCall, toWei, toEther } from "thirdweb";
import { useSendTransaction, useReadContract } from "thirdweb/react";

import DollarAuction from "../assets/abis/DollarAuction.json";
import Paradox from "../assets/abis/Paradox.json";
import { chain, client } from "../configs/thirdweb.config";
import useWallet from "./useWallet";
import environments from "../utils/environments";

const { DOLLAR_AUCTION_ADDRESS, TOKEN_ADDRESS } = environments;

const tokenContract = getContract({
  address: TOKEN_ADDRESS,
  abi: Paradox.abi,
  chain,
  client,
});

const gameContract = getContract({
  address: DOLLAR_AUCTION_ADDRESS,
  abi: DollarAuction.abi,
  chain,
  client,
});

const useDollarAuction = () => {
  const { wallet } = useWallet();
  const { mutateAsync } = useSendTransaction();
  const { data, isLoading, refetch } = useReadContract({
    contract: tokenContract,
    method: "allowance",
    params: [wallet.address, DOLLAR_AUCTION_ADDRESS],
  });
  const approvedTokenAmount = data ? toEther(data) : 0;

  const bid = async ({ amount }) => {
    if (isLoading) return;

    if (!amount) throw new Error("Invalid amount");
    if (amount > approvedTokenAmount) {
      const approveTransaction = prepareContractCall({
        contract: tokenContract,
        method: "approve",
        params: [DOLLAR_AUCTION_ADDRESS, toWei("1000000000")],
      });

      await mutateAsync(approveTransaction);
      refetch();
    }

    const transaction = prepareContractCall({
      contract: gameContract,
      method: "bid",
      params: [toWei(`${amount}`)],
    });

    const tx = await mutateAsync(transaction);

    return tx.transactionHash;
  };

  return { bid };
};

export default useDollarAuction;
