import { formatBytes32String } from "@ethersproject/strings";
import { getContract, prepareContractCall, toWei } from "thirdweb";
import { useSendTransaction, useReadContract } from "thirdweb/react";

import DollarAuction from "../assets/abis/DollarAuction.json";
import { chain, client } from "../configs/thirdweb.config";
import environments from "../utils/environments";

const { DOLLAR_AUCTION_ADDRESS } = environments;

const gameContract = getContract({
  address: DOLLAR_AUCTION_ADDRESS,
  abi: DollarAuction.abi,
  chain,
  client,
});

const useDollarAuction = () => {
  const { data, isLoading } = useReadContract({
    contract: gameContract,
    method: "roundWinner",
    params: [],
  });

  console.log({ data, isLoading });
};

export default useDollarAuction;
