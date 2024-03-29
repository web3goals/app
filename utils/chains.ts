import { Chain, polygon, polygonMumbai } from "wagmi/chains";
import { stringToAddress } from "./converters";

interface ChainConfig {
  chain: Chain;
  contractAddresses: {
    goal: string;
    profile: string;
    treasury: string;
  };
  subgraphApiUrl: string;
}

/**
 * Get chain configs defined by environment variables.
 */
export function getSupportedChainConfigs(): ChainConfig[] {
  const chainConfigs: ChainConfig[] = [];
  // Add mumbai
  if (
    process.env.NEXT_PUBLIC_MUMBAI_GOAL_CONTRACT_ADDRESS &&
    process.env.NEXT_PUBLIC_MUMBAI_PROFILE_CONTRACT_ADDRESS &&
    process.env.NEXT_PUBLIC_MUMBAI_TREASURY_CONTRACT_ADDRESS &&
    process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_API_URL
  ) {
    chainConfigs.push({
      chain: polygonMumbai,
      contractAddresses: {
        goal: process.env.NEXT_PUBLIC_MUMBAI_GOAL_CONTRACT_ADDRESS,
        profile: process.env.NEXT_PUBLIC_MUMBAI_PROFILE_CONTRACT_ADDRESS,
        treasury: process.env.NEXT_PUBLIC_MUMBAI_TREASURY_CONTRACT_ADDRESS,
      },
      subgraphApiUrl: process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_API_URL,
    });
  }
  // Add polygon
  if (
    process.env.NEXT_PUBLIC_POLYGON_GOAL_CONTRACT_ADDRESS &&
    process.env.NEXT_PUBLIC_POLYGON_PROFILE_CONTRACT_ADDRESS &&
    process.env.NEXT_PUBLIC_POLYGON_TREASURY_CONTRACT_ADDRESS &&
    process.env.NEXT_PUBLIC_POLYGON_SUBGRAPH_API_URL
  ) {
    chainConfigs.push({
      chain: polygon,
      contractAddresses: {
        goal: process.env.NEXT_PUBLIC_POLYGON_GOAL_CONTRACT_ADDRESS,
        profile: process.env.NEXT_PUBLIC_POLYGON_PROFILE_CONTRACT_ADDRESS,
        treasury: process.env.NEXT_PUBLIC_POLYGON_TREASURY_CONTRACT_ADDRESS,
      },
      subgraphApiUrl: process.env.NEXT_PUBLIC_POLYGON_SUBGRAPH_API_URL,
    });
  }
  return chainConfigs;
}

/**
 * Get chains using supported chain configs.
 */
export function getSupportedChains(): Chain[] {
  return getSupportedChainConfigs().map((chainConfig) => chainConfig.chain);
}

/**
 * Get the first chain config from supported chains.
 */
export function getDefaultSupportedChainConfig(): ChainConfig {
  const chainConfigs = getSupportedChainConfigs();
  if (chainConfigs.length === 0) {
    throw new Error("Supported chain config is not found");
  } else {
    return chainConfigs[0];
  }
}

/**
 * Return config of specified chain if it supported, otherwise return config of default supported chain.
 */
export function chainToSupportedChainConfig(
  chain: Chain | undefined
): ChainConfig {
  for (const config of getSupportedChainConfigs()) {
    if (config.chain.id === chain?.id) {
      return config;
    }
  }
  return getDefaultSupportedChainConfig();
}

/**
 * Return id of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainId(
  chain: Chain | undefined
): number | undefined {
  return chainToSupportedChainConfig(chain).chain.id;
}

/**
 * Return native currency symbol of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainNativeCurrencySymbol(
  chain: Chain | undefined
): string | undefined {
  return chainToSupportedChainConfig(chain).chain.nativeCurrency.symbol;
}

/**
 * Return goal contract address of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainGoalContractAddress(
  chain: Chain | undefined
): `0x${string}` | undefined {
  return stringToAddress(
    chainToSupportedChainConfig(chain).contractAddresses.goal
  );
}

/**
 * Return profile contract address of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainProfileContractAddress(
  chain: Chain | undefined
): `0x${string}` | undefined {
  return stringToAddress(
    chainToSupportedChainConfig(chain).contractAddresses.profile
  );
}

/**
 * Return treasury contract address of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainTreasuryContractAddress(
  chain: Chain | undefined
): `0x${string}` | undefined {
  return stringToAddress(
    chainToSupportedChainConfig(chain).contractAddresses.treasury
  );
}

/**
 * Return subgraph api url of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainSubgraphApiUrl(
  chain: Chain | undefined
): string {
  return chainToSupportedChainConfig(chain).subgraphApiUrl;
}
