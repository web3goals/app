import GoalActions from "components/goal/GoalActions";
import GoalParams from "components/goal/GoalParams";
import GoalWatchers from "components/goal/GoalWatchers";
import Layout from "components/layout";
import { CentralizedBox, FullWidthSkeleton } from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

/**
 * Page with a goal.
 */
export default function Goal() {
  const router = useRouter();
  const { slug } = router.query;
  const [goalId, setGoalId] = useState<string | undefined>();

  // State of contract reading to get goal uri
  const {
    data: goalUri,
    refetch: refetchGoalUri,
    isFetching: isGoalUriFetching,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_GOAL_CONTRACT_ADDRESS,
    abi: goalContractAbi,
    functionName: "tokenURI",
    args: goalId ? [BigNumber.from(goalId)] : undefined,
    enabled: goalId !== undefined,
  });

  // State of contract reading to get goal params
  const {
    data: goalParams,
    refetch: refetchGoalParams,
    isFetching: isGoalParamsFetching,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_GOAL_CONTRACT_ADDRESS,
    abi: goalContractAbi,
    functionName: "getParams",
    args: goalId ? [BigNumber.from(goalId)] : undefined,
    enabled: goalId !== undefined,
  });

  // State of contract reading to get goal watchers
  const {
    data: goalWatchers,
    refetch: refetchGoalWatchers,
    isFetching: isGoalWatchersFetching,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_GOAL_CONTRACT_ADDRESS,
    abi: goalContractAbi,
    functionName: "getWatchers",
    args: goalId ? [BigNumber.from(goalId)] : undefined,
    enabled: goalId !== undefined,
  });

  useEffect(() => {
    setGoalId(slug ? (slug as string) : undefined);
  }, [slug]);

  const isDataReady =
    goalId &&
    goalUri &&
    goalParams &&
    goalWatchers &&
    !isGoalUriFetching &&
    !isGoalParamsFetching &&
    !isGoalWatchersFetching;

  return (
    <Layout maxWidth="sm">
      <CentralizedBox>
        {isDataReady ? (
          <>
            <GoalParams
              id={goalId}
              uri={goalUri}
              createdTimestamp={goalParams.createdTimestamp}
              authorAddress={goalParams.authorAddress}
              authorStake={goalParams.authorStake}
              deadlineTimestamp={goalParams.deadlineTimestamp}
              isClosed={goalParams.isClosed}
              isAchieved={goalParams.isAchieved}
            />
            <GoalActions
              id={goalId}
              isClosed={goalParams.isClosed}
              onUpdate={() => {
                refetchGoalUri();
                refetchGoalParams();
                refetchGoalWatchers();
              }}
              sx={{ mt: 4 }}
            />
            <GoalWatchers
              id={goalId}
              authorAddress={goalParams.authorAddress}
              watchers={goalWatchers}
              sx={{ mt: 6 }}
            />
          </>
        ) : (
          <FullWidthSkeleton />
        )}
      </CentralizedBox>
    </Layout>
  );
}
