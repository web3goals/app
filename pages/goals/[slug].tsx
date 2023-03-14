import GoalActions from "components/goal/GoalActions";
import GoalMotivators from "components/goal/GoalMotivators";
import GoalParams from "components/goal/GoalParams";
import GoalProofs from "components/goal/GoalProofs";
import GoalSteps from "components/goal/GoalSteps";
import Layout from "components/layout";
import {
  CentralizedBox,
  FullWidthSkeleton,
  ThickDivider,
} from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getGoalContractAddress } from "utils/chains";
import { useContractRead, useNetwork } from "wagmi";

/**
 * Page with a goal.
 */
export default function Goal() {
  const router = useRouter();
  const { slug } = router.query;
  const { chain } = useNetwork();
  const [goalId, setGoalId] = useState<string | undefined>();

  // State of contract reading to get goal params
  const {
    data: goalParams,
    refetch: refetchGoalParams,
    isFetching: isGoalParamsFetching,
  } = useContractRead({
    address: getGoalContractAddress(chain),
    abi: goalContractAbi,
    functionName: "getParams",
    args: goalId ? [BigNumber.from(goalId)] : undefined,
    enabled: goalId !== undefined,
  });

  // State of contract reading to get goal motivators
  const {
    data: goalMotivators,
    refetch: refetchGoalMotivators,
    isFetching: isGoalMotivatorsFetching,
  } = useContractRead({
    address: getGoalContractAddress(chain),
    abi: goalContractAbi,
    functionName: "getMotivators",
    args: goalId ? [BigNumber.from(goalId)] : undefined,
    enabled: goalId !== undefined,
  });

  useEffect(() => {
    setGoalId(slug ? (slug as string) : undefined);
  }, [slug]);

  const isDataReady =
    goalId &&
    goalParams &&
    goalMotivators &&
    !isGoalParamsFetching &&
    !isGoalMotivatorsFetching;

  return (
    <Layout maxWidth="sm">
      <CentralizedBox>
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
            <GoalActions
              id={goalId}
              deadlineTimestamp={goalParams.deadlineTimestamp}
              isClosed={goalParams.isClosed}
              verificationRequirement={goalParams.verificationRequirement}
              onSuccess={() => {
                refetchGoalParams();
                refetchGoalMotivators();
              }}
              sx={{ mt: 4 }}
            />
            <ThickDivider sx={{ mt: 8 }} />
            <GoalProofs
              id={goalId}
              authorAddress={goalParams.authorAddress}
              isClosed={goalParams.isClosed}
              verificationRequirement={goalParams.verificationRequirement}
              onUpdate={() => {
                refetchGoalParams();
                refetchGoalMotivators();
              }}
              sx={{ mt: 8 }}
            />
            <ThickDivider sx={{ mt: 8 }} />
            <GoalMotivators
              id={goalId}
              authorAddress={goalParams.authorAddress}
              isClosed={goalParams.isClosed}
              motivators={goalMotivators}
              onUpdate={() => {
                refetchGoalParams();
                refetchGoalMotivators();
              }}
              sx={{ mt: 8 }}
            />
            <ThickDivider sx={{ mt: 8 }} />
            <GoalSteps id={goalId} sx={{ mt: 8 }} />
          </>
        ) : (
          <FullWidthSkeleton />
        )}
      </CentralizedBox>
    </Layout>
  );
}
