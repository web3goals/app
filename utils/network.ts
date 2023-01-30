import { Chain, polygonMumbai, polygon } from "wagmi/chains";

/**
 * Get contracts chain defined in environment.
 */
export function getContractsChain(): Chain {
  if (
    process.env.NEXT_PUBLIC_CONTRACTS_CHAIN_ID === polygonMumbai.id.toString()
  ) {
    return polygonMumbai;
  } else {
    console.error(
      "Failed to define the contracts chain, the application uses the Polygon Mainnet"
    );
    return polygon;
  }
}
