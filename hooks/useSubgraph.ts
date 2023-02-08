import axios from "axios";
import GoalEntity from "entities/GoalEntity";
import { getSubgraphApiUrl } from "utils/chains";
import { Chain } from "wagmi";

/**
 * Hook to work with subgraph.
 */
export default function useSubgraph() {
  const defaultFirst = 10;
  const defaultSkip = 0;

  let findGoals = async function (args: {
    chain: Chain | undefined;
    authorAddress?: string;
    isClosed?: boolean;
    isAchieved?: boolean;
    watcherAddress?: string;
    first?: number;
    skip?: number;
  }): Promise<Array<GoalEntity>> {
    // Prepare query
    const authorAddressFilter = args.authorAddress
      ? `authorAddress: "${args.authorAddress.toLowerCase()}"`
      : "";
    const isClosedFilter =
      args.isClosed !== undefined ? `isClosed: ${args.isClosed}` : "";
    const isAchievedFilter =
      args.isAchieved !== undefined ? `isAchieved: ${args.isAchieved}` : "";
    const watcherAddressFilter = args.watcherAddress
      ? `watcherAddresses_contains: ["${args.watcherAddress.toLowerCase()}"]`
      : "";
    const filterParams = `where: {${authorAddressFilter}, ${isClosedFilter}, ${isAchievedFilter}, ${watcherAddressFilter}}`;
    const sortParams = `orderBy: createdTimestamp, orderDirection: desc`;
    const paginationParams = `first: ${args.first || defaultFirst}, skip: ${
      args.skip || defaultSkip
    }`;
    const query = `{
      goals(${filterParams}, ${sortParams}, ${paginationParams}) {
        id
        uri
        createdTimestamp
        authorAddress
        authorStake
        deadlineTimestamp
        isClosed
        isAchieved
        watchersNumber
      }
    }`;
    // Make query and return result
    const response = await makeSubgraphQuery(args.chain, query);
    const goals: Array<GoalEntity> = [];
    response.goals?.forEach((goal: any) => {
      goals.push({
        id: goal.id,
        uri: goal.uri,
        createdTimestamp: goal.createdTimestamp,
        authorAddress: goal.authorAddress,
        authorStake: goal.authorStake,
        deadlineTimestamp: goal.deadlineTimestamp,
        isClosed: goal.isClosed,
        isAchieved: goal.isAchieved,
        watchersNumber: goal.watchersNumber,
      });
    });
    return goals;
  };

  return {
    findGoals,
  };
}

async function makeSubgraphQuery(chain: Chain | undefined, query: string) {
  try {
    const chainSubgraphApiUrl = getSubgraphApiUrl(chain);
    if (!chainSubgraphApiUrl) {
      throw new Error(`Chain does not support a subgraph`);
    }
    const response = await axios.post(chainSubgraphApiUrl, {
      query: query,
    });
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
