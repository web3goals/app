import GoalSetConnectWalletMessage from "components/goal/GoalSetConnectWalletMessage";
import GoalSetCreateProfileMessage from "components/goal/GoalSetCreateProfileMessage";
import GoalSetForm from "components/goal/GoalSetForm";
import GoalSetMessage from "components/goal/GoalSetMessage";
import Layout from "components/layout";
import { FullWidthSkeleton } from "components/styled";
import { profileContractAbi } from "contracts/abi/profileContract";
import { ethers } from "ethers";
import { useState } from "react";
import { chainToSupportedChainProfileContractAddress } from "utils/chains";
import { stringToAddress } from "utils/converters";
import { useAccount, useContractRead, useNetwork } from "wagmi";

/**
 * Page to set a goal.
 */
export default function SetGoal() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [goalSetId, setGoalSetId] = useState<string | undefined>();

  /**
   * Define account balance of profiles
   */
  const { data: balanceOfProfiles, isFetching: isBalanceOfProfilesFetching } =
    useContractRead({
      address: chainToSupportedChainProfileContractAddress(chain),
      abi: profileContractAbi,
      functionName: "balanceOf",
      args: [stringToAddress(address) || ethers.constants.AddressZero],
    });

  if (isBalanceOfProfilesFetching) {
    return (
      <Layout maxWidth="sm">
        <FullWidthSkeleton />
      </Layout>
    );
  } else if (!chain?.id) {
    return (
      <Layout maxWidth="sm">
        <GoalSetConnectWalletMessage />
      </Layout>
    );
  } else if (balanceOfProfiles?.isZero()) {
    return (
      <Layout maxWidth="sm">
        <GoalSetCreateProfileMessage />
      </Layout>
    );
  } else if (!goalSetId) {
    return (
      <Layout maxWidth="sm">
        <GoalSetForm
          onSuccessSet={(createdGoalId) => {
            setGoalSetId(createdGoalId);
            window.scrollTo(0, 0);
          }}
        />
      </Layout>
    );
  } else {
    return (
      <Layout maxWidth="sm">
        <GoalSetMessage id={goalSetId} />
      </Layout>
    );
  }
}
