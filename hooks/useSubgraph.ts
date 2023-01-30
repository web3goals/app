import axios from "axios";
import GoalEntity from "entities/GoalEntity";

/**
 * Hook to work with subgraph.
 */
export default function useSubgraph() {
  const defaultFirst = 10;
  const defaultSkip = 0;

  let findGoals = async function (args: {
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
    const response = await makeSubgraphQuery(query);
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

async function makeSubgraphQuery(query: string) {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_SUBGRAPH_API || "",
      {
        query: query,
      }
    );
    if (response.data.errors) {
      throw new Error(
        `error making subgraph query: ${JSON.stringify(response.data.errors)}`
      );
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      `could not query the subgraph: ${JSON.stringify(error.message)}`
    );
  }
}
