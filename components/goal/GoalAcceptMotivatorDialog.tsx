import { Dialog, DialogContent, Typography } from "@mui/material";
import {
  WidgetSeparatorText,
  ExtraLargeLoadingButton,
} from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber, ethers } from "ethers";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
import { Analytics } from "utils/analytics";
import {
  chainToSupportedChainId,
  chainToSupportedChainGoalContractAddress,
} from "utils/chains";
import { stringToAddress } from "utils/converters";
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

/**
 * Dialog to accept a goal motivator.
 */
export default function GoalAcceptMotivatorDialog(props: {
  id: string;
  motivatorAccountAddress: string;
  onSuccess?: Function;
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
      address: chainToSupportedChainGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "acceptMotivator",
      args: [
        BigNumber.from(props.id),
        stringToAddress(props.motivatorAccountAddress) ||
          ethers.constants.AddressZero,
      ],
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

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Motivator is accepted");
      Analytics.acceptedMotivator(props.id, chain?.id);
      close();
      props.onSuccess?.();
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
          sx={{ mb: 2 }}
        >
          🙏 Accepting
        </Typography>
        <WidgetSeparatorText mb={3}>
          the motivator who inspire you
        </WidgetSeparatorText>
        <ExtraLargeLoadingButton
          variant="contained"
          type="submit"
          disabled={isContractPrepareError || !contractWrite}
          loading={isContractWriteLoading || isTransactionLoading}
          onClick={() => contractWrite?.()}
        >
          Accept
        </ExtraLargeLoadingButton>
      </DialogContent>
    </Dialog>
  );
}
