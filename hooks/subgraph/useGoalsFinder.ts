import { SUBGRAPH } from "constants/subgraph";
import GoalEntity from "entities/subgraph/GoalEntity";
import useError from "hooks/useError";
import { useEffect, useState } from "react";
import { makeSubgraphQuery } from "utils/subgraph";
import { Chain } from "wagmi";

/**
 * Find goals in the subgraph.
 */
export default function useGoalsFinder(args: {
  chain?: Chain;
  authorAddress?: string;
  isClosed?: boolean;
  isAchieved?: boolean;
  motivatorAddress?: string;
  first?: number;
  skip?: number;
}) {
  const { handleError } = useError();
  const [data, setData] = useState<GoalEntity[] | undefined>();

  useEffect(() => {
    // Clear data
    setData(undefined);
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
    const paginationParams = `first: ${
      args.first || SUBGRAPH.defaultFirst
    }, skip: ${args.skip || SUBGRAPH.defaultSkip}`;
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
        extraDataURI
        messagesNumber
      }
    }`;
    // Make query
    makeSubgraphQuery(args.chain, query)
      .then((response) => {
        setData(
          response.goals?.map((responseGoal: any) => {
            const goal: GoalEntity = {
              id: responseGoal.id,
              createdTimestamp: responseGoal.createdTimestamp,
              description: responseGoal.description,
              authorAddress: responseGoal.authorAddress,
              authorStake: responseGoal.authorStake,
              deadlineTimestamp: responseGoal.deadlineTimestamp,
              isClosed: responseGoal.isClosed,
              isAchieved: responseGoal.isAchieved,
              extraDataURI: responseGoal.extraDataURI,
              messagesNumber: responseGoal.messagesNumber,
            };
            return goal;
          })
        );
      })
      .catch((error) => handleError(error, true));
  }, [
    args.chain,
    args.authorAddress,
    args.isClosed,
    args.isAchieved,
    args.motivatorAddress,
    args.first,
    args.skip,
  ]);

  return { data };
}
