import GoalMessages from "components/goal/GoalMessages";
import GoalParams from "components/goal/GoalParams";
import Layout from "components/layout";
import { FullWidthSkeleton, ThickDivider } from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import { chainToSupportedChainGoalContractAddress } from "utils/chains";
import { useContractRead, useNetwork } from "wagmi";

/**
 * Page with a goal.
 */
export default function Goal() {
  const router = useRouter();
  const { id } = router.query;
  const { chain } = useNetwork();

  const {
    data: goalParams,
    refetch: refetchGoalParams,
    isFetching: isGoalParamsFetching,
  } = useContractRead({
    address: chainToSupportedChainGoalContractAddress(chain),
    abi: goalContractAbi,
    functionName: "getParams",
    args: id ? [BigNumber.from(id)] : undefined,
    enabled: id !== undefined,
  });

  return (
    <Layout maxWidth="sm">
      {id && goalParams && !isGoalParamsFetching ? (
        <>
          <GoalParams
            id={id.toString()}
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
            id={id.toString()}
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
