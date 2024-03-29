import { SUBGRAPH } from "constants/subgraph";
import AccountEntity from "entities/subgraph/AccountEntity";
import useError from "hooks/useError";
import { useEffect, useState } from "react";
import { makeSubgraphQuery } from "utils/subgraph";
import { Chain } from "wagmi";

/**
 * Find accounts in the subgraph.
 */
export default function useAccountsFinder(args: {
  chain?: Chain;
  id?: string;
  first?: number;
  skip?: number;
}): { data: AccountEntity[] | undefined } {
  const { handleError } = useError();
  const [data, setData] = useState<AccountEntity[] | undefined>();

  useEffect(() => {
    // Clear data
    setData(undefined);
    // Prepare query
    const idFilter = args.id ? `id: "${args.id.toLowerCase()}"` : "";
    const filterParams = `where: {${idFilter}}`;
    const sortParams = `orderBy: profileCreatedTimestamp, orderDirection: desc`;
    const paginationParams = `first: ${
      args.first || SUBGRAPH.defaultFirst
    }, skip: ${args.skip || SUBGRAPH.defaultSkip}`;
    const query = `{
     accounts(${filterParams}, ${sortParams}, ${paginationParams}) {
       id
       profileId
       profileCreatedTimestamp
       profileUri
       goals
       achievedGoals
       failedGoals
       motivations
       superMotivations
     }
   }`;
    // Make query
    makeSubgraphQuery(args.chain, query)
      .then((response) => {
        setData(
          response.accounts?.map((responseAccount: any) => {
            const account: AccountEntity = {
              id: responseAccount.id,
              profileId: responseAccount.profileId,
              profileCreatedTimestamp: responseAccount.profileCreatedTimestamp,
              profileUri: responseAccount.profileUri,
              goals: responseAccount.goals,
              achievedGoals: responseAccount.achievedGoals,
              failedGoals: responseAccount.failedGoals,
              motivations: responseAccount.motivations,
              superMotivations: responseAccount.superMotivations,
            };
            return account;
          })
        );
      })
      .catch((error) => handleError(error, true));
  }, [args.chain, args.id, args.first, args.skip]);

  return { data };
}
