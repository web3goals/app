import axios from "axios";
import { Chain } from "wagmi";
import { chainToSupportedChainSubgraphApiUrl } from "./chains";

/**
 * Make query in the subgraph.
 */
export async function makeSubgraphQuery(
  chain: Chain | undefined,
  query: string
) {
  try {
    const response = await axios.post(
      chainToSupportedChainSubgraphApiUrl(chain),
      { query: query }
    );
    if (response.data.errors) {
      throw new Error(JSON.stringify(response.data.errors));
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      `Could not query the subgraph: ${JSON.stringify(error.message)}`
    );
  }
}
