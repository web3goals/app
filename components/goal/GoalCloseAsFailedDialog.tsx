import { Dialog, DialogContent, Typography } from "@mui/material";
import { XxlLoadingButton } from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
import { getChainId, getGoalContractAddress } from "utils/chains";
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

/**
 * Dialog to close a goal as failed.
 */
export default function GoalCloseAsFailedDialog(props: {
  id: string;
  onUpdate?: Function;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();
  const { showToastSuccess, showToastError } = useToasts();

  // Dialog states
  const [isOpen, setIsOpen] = useState(!props.isClose);

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "closeAsFailed",
      args: [BigNumber.from(props.id)],
      chainId: getChainId(chain),
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

  // Form states
  const isFormLoading = isContractWriteLoading || isTransactionLoading;
  const isFormDisabled = isFormLoading || isTransactionSuccess;
  const isFormSubmitButtonDisabled =
    isFormDisabled || isContractPrepareError || !contractWrite;

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Goal is closed as failed!");
      props.onUpdate?.();
      close();
    }
  }, [isTransactionSuccess]);

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
          sx={{ mb: 3 }}
        >
          🤝 Dear Web3,
        </Typography>
        {/* Button */}
        <XxlLoadingButton
          loading={isFormLoading}
          variant="contained"
          type="submit"
          disabled={isFormSubmitButtonDisabled}
          onClick={() => contractWrite?.()}
          sx={{ mb: 3 }}
        >
          Close Goal As Failed
        </XxlLoadingButton>
        {/* Text */}
        <Typography
          fontWeight={700}
          textAlign="center"
          sx={{ px: { xs: 0, md: 12 } }}
        >
          the stake will be shared between watchers and application after
          closing
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
