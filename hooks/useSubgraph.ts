import axios from "axios";
import AccountEntity from "entities/AccountEntity";
import GoalEntity from "entities/GoalEntity";
import { getSubgraphApiUrl } from "utils/chains";
import { Chain } from "wagmi";

/**
 * Hook to work with subgraph.
 */
export default function useSubgraph() {
  const defaultFirst = 10;
  const defaultSkip = 0;

  let findAccounts = async function (args: {
    chain: Chain | undefined;
    id?: string;
    first?: number;
    skip?: number;
  }): Promise<Array<AccountEntity>> {
    // Prepare query
    const idFilter = args.id ? `id: "${args.id.toLowerCase()}"` : "";
    const filterParams = `where: {${idFilter}}`;
    const paginationParams = `first: ${args.first || defaultFirst}, skip: ${
      args.skip || defaultSkip
    }`;
    const query = `{
     accounts(${filterParams}, ${paginationParams}) {
       id
       achievedGoals
       failedGoals
       motivatedGoals
       notMotivatedGoals
     }
   }`;
    // Make query and return result
    const response = await makeSubgraphQuery(args.chain, query);
    const accounts: Array<AccountEntity> = [];
    response.accounts?.forEach((account: any) => {
      accounts.push({
        id: account.id,
        achievedGoals: account.achievedGoals,
        failedGoals: account.failedGoals,
        motivatedGoals: account.motivatedGoals,
        notMotivatedGoals: account.notMotivatedGoals,
      });
    });
    return accounts;
  };

  let findGoals = async function (args: {
    chain: Chain | undefined;
    authorAddress?: string;
    isClosed?: boolean;
    isAchieved?: boolean;
    motivatorAddress?: string;
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
    const motivatorAddressFilter = args.motivatorAddress
      ? `motivatorAddresses_contains: ["${args.motivatorAddress.toLowerCase()}"]`
      : "";
    const filterParams = `where: {${authorAddressFilter}, ${isClosedFilter}, ${isAchievedFilter}, ${motivatorAddressFilter}}`;
    const sortParams = `orderBy: createdTimestamp, orderDirection: desc`;
    const paginationParams = `first: ${args.first || defaultFirst}, skip: ${
      args.skip || defaultSkip
    }`;
    const query = `{
      goals(${filterParams}, ${sortParams}, ${paginationParams}) {
        id
        createdTimestamp
        description
        authorAddress
        authorStake
        deadlineTimestamp
        isClosed
        isAchieved
        motivatorsNumber
      }
    }`;
    // Make query and return result
    const response = await makeSubgraphQuery(args.chain, query);
    const goals: Array<GoalEntity> = [];
    response.goals?.forEach((goal: any) => {
      goals.push({
        id: goal.id,
        createdTimestamp: goal.createdTimestamp,
        description: goal.description,
        authorAddress: goal.authorAddress,
        authorStake: goal.authorStake,
        deadlineTimestamp: goal.deadlineTimestamp,
        isClosed: goal.isClosed,
        isAchieved: goal.isAchieved,
        motivatorsNumber: goal.motivatorsNumber,
      });
    });
    return goals;
  };

  return {
    findAccounts,
    findGoals,
  };
}

async function makeSubgraphQuery(chain: Chain | undefined, query: string) {
  try {
    const chainSubgraphApiUrl = getSubgraphApiUrl(chain);
    if (!chainSubgraphApiUrl) {
      throw new Error(`Chain '${chain?.name}' does not support a subgraph`);
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
