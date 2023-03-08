import { Dialog, DialogContent, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import {
  FullWidthSkeleton,
  WidgetSeparatorText,
  XxlLoadingButton,
} from "components/styled";
import { VERIFICATION_REQUIREMENTS } from "constants/verifiers";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
import { getChainId, getGoalContractAddress } from "utils/chains";
import { dateToBigNumberTimestamp } from "utils/converters";
import {
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

/**
 * Dialog to close a goal.
 */
export default function GoalCloseDialog(props: {
  id: string;
  deadlineTimestamp: BigNumber;
  verificationRequirement: string;
  onSuccess?: Function;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();

  // Dialog states
  const [isOpen, setIsOpen] = useState(!props.isClose);

  // State of contract reading to get goal verification status
  const {
    data: goalVerificationStatus,
    isFetching: isGoalVerificationStatusFetching,
  } = useContractRead({
    address: getGoalContractAddress(chain),
    abi: goalContractAbi,
    functionName: "getVerificationStatus",
    args: [BigNumber.from(props.id)],
  });

  const isDeadlinePassed = dateToBigNumberTimestamp(new Date()).gt(
    props.deadlineTimestamp
  );

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          my: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: 2 }}
        >
          🏁 Closing
        </Typography>
        {goalVerificationStatus && !isGoalVerificationStatusFetching ? (
          goalVerificationStatus.isAchieved || isDeadlinePassed ? (
            <GoalCloseForm
              id={props.id}
              isVerificationStatusAchieved={goalVerificationStatus.isAchieved}
              onSuccess={() => {
                close();
                props.onSuccess?.();
              }}
            />
          ) : (
            <GoalVerifyForm
              id={props.id}
              verificationRequirement={props.verificationRequirement}
              onSuccess={() => {
                close();
                props.onSuccess?.();
              }}
            />
          )
        ) : (
          <FullWidthSkeleton />
        )}
      </DialogContent>
    </Dialog>
  );
}

function GoalVerifyForm(props: {
  id: string;
  verificationRequirement: string;
  onSuccess?: Function;
}) {
  const { chain } = useNetwork();
  const { showToastSuccess, showToastError } = useToasts();

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "verify",
      args: [BigNumber.from(props.id)],
      chainId: getChainId(chain),
      onError(error: any) {
        showToastError(error, goalContractAbi);
      },
    });
  const {
    data: contractWriteData,
    isLoading: isContractWriteLoading,
    write: contractWrite,
  } = useContractWrite(contractPrepareConfig);
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransaction({
      hash: contractWriteData?.hash,
    });

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess(
        "The verification will be completed soon, try to close the goal later"
      );
      props.onSuccess?.();
    }
  }, [isTransactionSuccess]);

  return (
    <>
      <WidgetSeparatorText mb={3}>
        verify the achievement to close the goal
      </WidgetSeparatorText>
      <XxlLoadingButton
        variant="contained"
        type="submit"
        disabled={isContractPrepareError || !contractWrite}
        loading={isContractWriteLoading || isTransactionLoading}
        onClick={() => contractWrite?.()}
        sx={{ mb: 3 }}
      >
        Verify
      </XxlLoadingButton>
      {/* Proof file input */}
      {props.verificationRequirement ===
        VERIFICATION_REQUIREMENTS.anyProofUri && (
        <WidgetSeparatorText color={grey[600]}>
          don't forget to add proofs before verification
        </WidgetSeparatorText>
      )}
    </>
  );
}

function GoalCloseForm(props: {
  id: string;
  isVerificationStatusAchieved: boolean;
  onSuccess?: Function;
}) {
  const { chain } = useNetwork();
  const { showToastSuccess, showToastError } = useToasts();

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "close",
      args: [BigNumber.from(props.id)],
      chainId: getChainId(chain),
      onError(error: any) {
        showToastError(error, goalContractAbi);
      },
    });
  const {
    data: contractWriteData,
    isLoading: isContractWriteLoading,
    write: contractWrite,
  } = useContractWrite(contractPrepareConfig);
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransaction({
      hash: contractWriteData?.hash,
    });

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Goal is closed!");
      props.onSuccess?.();
    }
  }, [isTransactionSuccess]);

  return (
    <>
      <WidgetSeparatorText mb={3}>
        {props.isVerificationStatusAchieved
          ? "the goal is verified as achieved, now it can be closed"
          : "the goal is not achieved by the deadline, so it can only be closed as a failed"}
      </WidgetSeparatorText>
      <XxlLoadingButton
        variant="contained"
        type="submit"
        disabled={isContractPrepareError || !contractWrite}
        loading={isContractWriteLoading || isTransactionLoading}
        onClick={() => contractWrite?.()}
        sx={{ mb: 3 }}
      >
        Close
      </XxlLoadingButton>
      <WidgetSeparatorText color={grey[600]}>
        {props.isVerificationStatusAchieved
          ? "the stake will be returned after closing"
          : "the stake will be shared between watchers and application after closing"}
      </WidgetSeparatorText>
    </>
  );
}
