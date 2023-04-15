import GoalEntity from "entities/subgraph/GoalEntity";
import GoalStepEntity from "entities/subgraph/GoalStepEntity";
import { makeSubgraphQuery } from "utils/subgraph";
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

  let findGoalSteps = async function (args: {
    chain: Chain | undefined;
    goal: string;
    first?: number;
    skip?: number;
  }): Promise<Array<GoalStepEntity>> {
    // Prepare query
    const goalFilter = args.goal ? `goal: "${args.goal}"` : "";
    const filterParams = `where: {${goalFilter}}`;
    const sortParams = `orderBy: createdTimestamp, orderDirection: desc`;
    const paginationParams = `first: ${args.first || defaultFirst}, skip: ${
      args.skip || defaultSkip
    }`;
    const query = `{
      goalSteps(${filterParams}, ${sortParams}, ${paginationParams}) {
        id
        goal {
          id
        }
        createdTimestamp
        authorAddress
        type
        extraData
        extraDataUri
      }
    }`;
    // Make query and return result
    const response = await makeSubgraphQuery(args.chain, query);
    const goalSteps: Array<GoalStepEntity> = [];
    response.goalSteps?.forEach((goalStep: any) => {
      goalSteps.push({
        id: goalStep.id,
        goal: {
          id: goalStep.goal.id,
        },
        createdTimestamp: goalStep.createdTimestamp,
        authorAddress: goalStep.authorAddress,
        type: goalStep.type,
        extraData: goalStep.extraData,
        extraDataUri: goalStep.extraDataUri,
      });
    });
    return goalSteps;
  };

  return {
    findGoals,
    findGoalSteps,
  };
}
