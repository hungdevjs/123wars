import { StaticJsonRpcProvider } from "@ethersproject/providers";

import environments from "../utils/environments.js";

const { QUICKNODE_HTTPS_ENDPOINT, NETWORK_ID } = environments;

const quickNode = new StaticJsonRpcProvider(
  QUICKNODE_HTTPS_ENDPOINT,
  Number(NETWORK_ID)
);

export default quickNode;

export const getProvider = () => {
  const provider = new StaticJsonRpcProvider(
    QUICKNODE_HTTPS_ENDPOINT,
    Number(NETWORK_ID)
  );

  return provider;
};
