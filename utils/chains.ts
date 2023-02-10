import { Chain, filecoinHyperspace, polygonMumbai } from "wagmi/chains";
import { stringToAddress } from "./converters";

/**
 * Help variables
 */
const mumbaiGoalContractAddress =
  process.env.NEXT_PUBLIC_MUMBAI_GOAL_CONTRACT_ADDRESS;
const mumbaiBioContractAddress =
  process.env.NEXT_PUBLIC_MUMBAI_BIO_CONTRACT_ADDRESS;
const mumbaiSubgraphApiUrl = process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_API_URL;

const hyperspaceGoalContractAddress =
  process.env.NEXT_PUBLIC_HYPERSPACE_GOAL_CONTRACT_ADDRESS;
const hyperspaceBioContractAddress =
  process.env.NEXT_PUBLIC_HYPERSPACE_BIO_CONTRACT_ADDRESS;
const hyperspaceSubgraphApiUrl =
  process.env.NEXT_PUBLIC_HYPERSPACE_SUBGRAPH_API_URL;

const mantleTestnetGoalContractAddress =
  process.env.NEXT_PUBLIC_MANTLE_TESTNET_GOAL_CONTRACT_ADDRESS;
const mantleTestnetBioContractAddress =
  process.env.NEXT_PUBLIC_MANTLE_TESTNET_BIO_CONTRACT_ADDRESS;
const mantleTestnetSubgraphApiUrl =
  process.env.NEXT_PUBLIC_MANTLE_TESTNET_SUBGRAPH_API_URL;

/**
 * Get mantle testnet chain.
 */
export function getMantleTestnetChain(): Chain {
  return {
    id: 5001,
    name: "Mantle Testnet",
    network: "mantle-testnet",
    nativeCurrency: {
      decimals: 18,
      name: "BIT",
      symbol: "BIT",
    },
    rpcUrls: {
      default: {
        http: ["https://rpc.testnet.mantle.xyz"],
      },
      public: {
        http: ["https://rpc.testnet.mantle.xyz"],
      },
    },
    blockExplorers: {
      default: {
        name: "Mantle Network Explorer",
        url: "https://explorer.testnet.mantle.xyz",
      },
    },
  };
}

/**
 * Get the first chain from supported chains.
 */
export function getDefaultChain(): Chain | undefined {
  const chains = getSupportedChains();
  if (chains.length !== 0) {
    return chains[0];
  } else {
    return undefined;
  }
}

/**
 * Get chains that defined in environment variables.
 */
export function getSupportedChains(): Array<Chain> {
  const chains: Array<Chain> = [];
  if (mumbaiGoalContractAddress && mumbaiBioContractAddress) {
    chains.push(polygonMumbai);
  }
  if (hyperspaceGoalContractAddress && hyperspaceBioContractAddress) {
    chains.push(filecoinHyperspace);
  }
  if (mantleTestnetGoalContractAddress && mantleTestnetBioContractAddress) {
    chains.push(getMantleTestnetChain());
  }
  if (chains.length === 0) {
    console.error("Not found supported chains");
  }
  return chains;
}

/**
 * Get id of specified or default chain.
 */
export function getChainId(chain: Chain | undefined): number | undefined {
  if (chain === undefined) {
    chain = getDefaultChain();
  }
  return chain?.id;
}

/**
 * Get native currency symbol of specified or default chain.
 */
export function getChainNativeCurrencySymbol(
  chain: Chain | undefined
): string | undefined {
  if (chain === undefined) {
    chain = getDefaultChain();
  }
  return chain?.nativeCurrency?.symbol;
}

/**
 * Get address that defined in environment variables.
 */
export function getGoalContractAddress(
  chain: Chain | undefined
): `0x${string}` | undefined {
  if (chain === undefined) {
    chain = getDefaultChain();
  }
  if (chain?.id === polygonMumbai.id && mumbaiGoalContractAddress) {
    return stringToAddress(mumbaiGoalContractAddress);
  }
  if (chain?.id === filecoinHyperspace.id && hyperspaceGoalContractAddress) {
    return stringToAddress(hyperspaceGoalContractAddress);
  }
  if (
    chain?.id === getMantleTestnetChain().id &&
    mantleTestnetGoalContractAddress
  ) {
    return stringToAddress(mantleTestnetGoalContractAddress);
  }
  console.error(`Not found goal contract address for chain: ${chain?.name}`);
  return undefined;
}

/**
 * Get address that defined in environment variables.
 */
export function getBioContractAddress(
  chain: Chain | undefined
): `0x${string}` | undefined {
  if (chain === undefined) {
    chain = getDefaultChain();
  }
  if (chain?.id === polygonMumbai.id && mumbaiBioContractAddress) {
    return stringToAddress(mumbaiBioContractAddress);
  }
  if (chain?.id === filecoinHyperspace.id && hyperspaceBioContractAddress) {
    return stringToAddress(hyperspaceBioContractAddress);
  }
  if (getMantleTestnetChain().id && mantleTestnetBioContractAddress) {
    return stringToAddress(mantleTestnetBioContractAddress);
  }
  console.error(`Not found bio contract address for chain: ${chain?.name}`);
  return undefined;
}

/**
 * Get subgraph api url defined in environment variables.
 */
export function getSubgraphApiUrl(chain: Chain | undefined) {
  if (chain === undefined) {
    chain = getDefaultChain();
  }
  if (chain?.id === polygonMumbai.id && mumbaiSubgraphApiUrl) {
    return mumbaiSubgraphApiUrl;
  }
  if (chain?.id === filecoinHyperspace.id && hyperspaceSubgraphApiUrl) {
    return hyperspaceSubgraphApiUrl;
  }
  if (getMantleTestnetChain().id && mantleTestnetSubgraphApiUrl) {
    return mantleTestnetSubgraphApiUrl;
  }
  console.error(`Not found subgraph api url for chain: ${chain?.name}`);
  return undefined;
}
