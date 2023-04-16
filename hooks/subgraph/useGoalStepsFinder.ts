import { SUBGRAPH } from "constants/subgraph";
import GoalStepEntity from "entities/subgraph/GoalStepEntity";
import useError from "hooks/useError";
import { useEffect, useState } from "react";
import { makeSubgraphQuery } from "utils/subgraph";
import { Chain } from "wagmi";

/**
 * Find goal steps in the subgraph.
 */
export default function useGoalStepsFinder(args: {
  chain?: Chain;
  goal?: string;
  first?: number;
  skip?: number;
}) {
  const { handleError } = useError();
  const [data, setData] = useState<GoalStepEntity[] | undefined>();

  useEffect(() => {
    // Clear data
    setData(undefined);
    // Prepare query
    const goalFilter = args.goal ? `goal: "${args.goal}"` : "";
    const filterParams = `where: {${goalFilter}}`;
    const sortParams = `orderBy: createdTimestamp, orderDirection: desc`;
    const paginationParams = `first: ${
      args.first || SUBGRAPH.defaultFirst
    }, skip: ${args.skip || SUBGRAPH.defaultSkip}`;
    const query = `{
      goalSteps(${filterParams}, ${sortParams}, ${paginationParams}) {
        id
        goal {
          id
          description
          authorAddress
          isClosed
        }
        createdTimestamp
        authorAddress
        type
        extraData
        extraDataUri
      }
    }`;
    // Make query
    makeSubgraphQuery(args.chain, query)
      .then((response) => {
        setData(
          response.goalSteps?.map((responseGoalStep: any) => {
            const goalStep: GoalStepEntity = {
              id: responseGoalStep.id,
              goal: {
                id: responseGoalStep.goal.id,
                description: responseGoalStep.goal.description,
                authorAddress: responseGoalStep.goal.authorAddress,
                isClosed: responseGoalStep.goal.isClosed,
              },
              createdTimestamp: responseGoalStep.createdTimestamp,
              authorAddress: responseGoalStep.authorAddress,
              type: responseGoalStep.type,
              extraData: responseGoalStep.extraData,
              extraDataUri: responseGoalStep.extraDataUri,
            };
            return goalStep;
          })
        );
      })
      .catch((error) => handleError(error, true));
  }, [args.chain, args.goal, args.first, args.skip]);

  return { data };
}
