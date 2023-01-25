import { chain, Chain } from "wagmi";

/**
 * Get contracts chain defined in environment.
 */
export function getContractsChain(): Chain {
  if (
    process.env.NEXT_PUBLIC_CONTRACTS_CHAIN_ID ===
    chain.polygonMumbai.id.toString()
  ) {
    return chain.polygonMumbai;
  } else {
    console.error(
      "Failed to define the contracts chain, the application uses the Polygon Mainnet"
    );
    return chain.polygon;
  }
}
