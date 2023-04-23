import { SUBGRAPH } from "constants/subgraph";
import GoalMessageEntity from "entities/subgraph/GoalMessageEntity";
import useError from "hooks/useError";
import { useEffect, useState } from "react";
import { makeSubgraphQuery } from "utils/subgraph";
import { Chain } from "wagmi";

/**
 * Find goal messages in the subgraph.
 */
export default function useGoalMessagesFinder(args: {
  chain?: Chain;
  goal?: string;
  first?: number;
  skip?: number;
}) {
  const { handleError } = useError();
  const [data, setData] = useState<GoalMessageEntity[] | undefined>();

  useEffect(() => {
    // Clear data
    setData(undefined);
    // Prepare query
    const goalFilter = args.goal ? `goal: "${args.goal}"` : "";
    const filterParams = `where: {${goalFilter}}`;
    const sortParams = `orderBy: addedTimestamp, orderDirection: desc`;
    const paginationParams = `first: ${
      args.first || SUBGRAPH.defaultFirst
    }, skip: ${args.skip || SUBGRAPH.defaultSkip}`;
    const query = `{
      goalMessages(${filterParams}, ${sortParams}, ${paginationParams}) {
        id
        goal {
          id
          description
          authorAddress
          isClosed
        }
        addedTimestamp
        authorAddress
        type
        isMotivating
        isSuperMotivating
        extraDataUri
      }
    }`;
    // Make query
    makeSubgraphQuery(args.chain, query)
      .then((response) => {
        setData(
          response.goalMessages?.map((responseGoalMessage: any) => {
            const goalMessage: GoalMessageEntity = {
              id: responseGoalMessage.id,
              goal: {
                id: responseGoalMessage.goal.id,
                description: responseGoalMessage.goal.description,
                authorAddress: responseGoalMessage.goal.authorAddress,
                isClosed: responseGoalMessage.goal.isClosed,
              },
              addedTimestamp: responseGoalMessage.addedTimestamp,
              authorAddress: responseGoalMessage.authorAddress,
              type: responseGoalMessage.type,
              isMotivating: responseGoalMessage.isMotivating,
              isSuperMotivating: responseGoalMessage.isSuperMotivating,
              extraDataUri: responseGoalMessage.extraDataUri,
            };
            return goalMessage;
          })
        );
      })
      .catch((error) => handleError(error, true));
  }, [args.chain, args.goal, args.first, args.skip]);

  return { data };
}
