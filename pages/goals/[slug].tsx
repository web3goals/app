import GoalParams from "components/goal/GoalParams";
import GoalMessages from "components/goal/GoalMessages";
import Layout from "components/layout";
import { FullWidthSkeleton, ThickDivider } from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { chainToSupportedChainGoalContractAddress } from "utils/chains";
import { useContractRead, useNetwork } from "wagmi";

/**
 * Page with a goal.
 */
export default function Goal() {
  const router = useRouter();
  const { slug } = router.query; // TODO: Rename to id
  const { chain } = useNetwork();
  const [goalId, setGoalId] = useState<string | undefined>();

  const {
    data: goalParams,
    refetch: refetchGoalParams,
    isFetching: isGoalParamsFetching,
  } = useContractRead({
    address: chainToSupportedChainGoalContractAddress(chain),
    abi: goalContractAbi,
    functionName: "getParams",
    args: goalId ? [BigNumber.from(goalId)] : undefined,
    enabled: goalId !== undefined,
  });

  useEffect(() => {
    setGoalId(slug ? (slug as string) : undefined);
  }, [slug]);

  const isDataReady = goalId && goalParams && !isGoalParamsFetching;

  return (
    <Layout maxWidth="sm">
      {isDataReady ? (
        <>
          <GoalParams
            id={goalId}
            createdTimestamp={goalParams.createdTimestamp}
            description={goalParams.description}
            authorAddress={goalParams.authorAddress}
            authorStake={goalParams.authorStake}
            deadlineTimestamp={goalParams.deadlineTimestamp}
            isClosed={goalParams.isClosed}
            isAchieved={goalParams.isAchieved}
          />
          <ThickDivider sx={{ mt: 8 }} />
          <GoalMessages
            id={goalId}
            authorAddress={goalParams.authorAddress}
            deadlineTimestamp={goalParams.deadlineTimestamp}
            isClosed={goalParams.isClosed}
            onUpdate={() => {
              refetchGoalParams();
            }}
            sx={{ mt: 8 }}
          />
        </>
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}
