import { SxProps } from "@mui/material";
import { Stack } from "@mui/system";
import GoalShareDialog from "components/dialog/GoalShareDialog";
import { XlLoadingButton } from "components/styled";
import { DialogContext } from "context/dialog";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import useToasts from "hooks/useToast";
import { useContext, useEffect } from "react";
import { getContractsChain } from "utils/network";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

/**
 * A component with goal actions.
 */
export default function GoalActions(props: {
  id: string;
  isClosed: boolean;
  onUpdate: Function;
  sx?: SxProps;
}) {
  return (
    <Stack
      direction="column"
      spacing={2}
      justifyContent="center"
      sx={{ ...props.sx }}
    >
      <GoalWatchButton id={props.id} onSuccess={() => props.onUpdate?.()} />
      <GoalShareButton id={props.id} />
    </Stack>
  );
}

function GoalWatchButton(props: { id: string; onSuccess?: Function }) {
  const { showToastSuccess } = useToasts();

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: process.env.NEXT_PUBLIC_GOAL_CONTRACT_ADDRESS,
      abi: goalContractAbi,
      functionName: "watch",
      args: [BigNumber.from(props.id)],
      chainId: getContractsChain().id,
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

  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("👀 You are now a goal watcher!");
      props.onSuccess?.();
    }
  }, [isTransactionSuccess]);

  return (
    <XlLoadingButton
      variant="contained"
      disabled={isContractPrepareError || !contractWrite}
      loading={isContractWriteLoading || isTransactionLoading}
      onClick={() => contractWrite?.()}
    >
      Watch
    </XlLoadingButton>
  );
}

function GoalShareButton(props: { id: string }) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <XlLoadingButton
      variant="outlined"
      onClick={() =>
        showDialog?.(<GoalShareDialog id={props.id} onClose={closeDialog} />)
      }
    >
      Share
    </XlLoadingButton>
  );
}
