import { Dialog, Link as MuiLink, Typography } from "@mui/material";
import {
  DialogCenterContent,
  ExtraLargeLoadingButton,
  FullWidthSkeleton,
} from "components/styled";
import { DialogContext } from "context/dialog";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import useToasts from "hooks/useToast";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Analytics } from "utils/analytics";
import {
  chainToSupportedChainGoalContractAddress,
  chainToSupportedChainId,
} from "utils/chains";
import { dateToBigNumberTimestamp } from "utils/converters";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import GoalPostProofDialog from "./GoalPostProofDialog";

/**
 * Dialog to close a goal.
 */
export default function GoalCloseDialog(props: {
  id: string;
  authorAddress: string;
  deadlineTimestamp: BigNumber;
  onSuccess?: Function;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();

  // Dialog states
  const [isOpen, setIsOpen] = useState(!props.isClose);

  // State of contract reading to get goal proofs
  const { data: goalProofs, isFetching: isGoalProofsFetching } =
    useContractRead({
      address: chainToSupportedChainGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "getProofs",
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
      <DialogCenterContent>
        {goalProofs && !isGoalProofsFetching ? (
          goalProofs.length > 0 || isDeadlinePassed ? (
            <GoalCanBeClosedDialogContent
              id={props.id}
              isDeadlinePassed={isDeadlinePassed}
              onSuccess={() => {
                close();
                props.onSuccess?.();
              }}
            />
          ) : (
            <GoalRequireProofDialogContent
              id={props.id}
              authorAddress={props.authorAddress}
              onSuccess={() => {
                close();
                props.onSuccess?.();
              }}
            />
          )
        ) : (
          <FullWidthSkeleton />
        )}
      </DialogCenterContent>
    </Dialog>
  );
}

function GoalRequireProofDialogContent(props: {
  id: string;
  authorAddress: string;
  onSuccess?: Function;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { address } = useAccount();

  return (
    <>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🏁 Closing goal
      </Typography>
      <Typography textAlign="center" mt={1}>
        is not available right now, proof of achievement must first be posted
      </Typography>
      {address === props.authorAddress && (
        <ExtraLargeLoadingButton
          variant="outlined"
          onClick={() =>
            showDialog?.(
              <GoalPostProofDialog
                id={props.id}
                onSuccess={props.onSuccess}
                onClose={closeDialog}
              />
            )
          }
          sx={{ mt: 4 }}
        >
          Post proof
        </ExtraLargeLoadingButton>
      )}
    </>
  );
}

function GoalCanBeClosedDialogContent(props: {
  id: string;
  isDeadlinePassed: boolean;
  onSuccess?: Function;
}) {
  const { chain } = useNetwork();
  const { showToastSuccess, showToastError } = useToasts();

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: chainToSupportedChainGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "close",
      args: [BigNumber.from(props.id)],
      chainId: chainToSupportedChainId(chain),
      onError(error: any) {
        showToastError(error);
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
      Analytics.closedGoal(props.id, !props.isDeadlinePassed, chain?.id);
      props.onSuccess?.();
    }
  }, [isTransactionSuccess]);

  return (
    <>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🏁 Close goal
      </Typography>
      <Typography textAlign="center" mt={1}>
        {!props.isDeadlinePassed ? (
          <>as achieved and return the stake to the author</>
        ) : (
          <>
            as failed because the deadline has expired, and{" "}
            <Link href={"/#faq-how-stake-is-shared"} passHref legacyBehavior>
              <MuiLink>share</MuiLink>
            </Link>{" "}
            the stake between motivators and this application
          </>
        )}
      </Typography>
      <ExtraLargeLoadingButton
        variant="outlined"
        type="submit"
        disabled={isContractPrepareError || !contractWrite}
        loading={isContractWriteLoading || isTransactionLoading}
        onClick={() => contractWrite?.()}
        sx={{ mt: 4 }}
      >
        Submit
      </ExtraLargeLoadingButton>
    </>
  );
}
