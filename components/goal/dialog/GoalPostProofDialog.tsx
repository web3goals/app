import { Dialog, Typography } from "@mui/material";
import TextAttachmentForm from "components/form/TextAttachmentForm";
import { DialogCenterContent } from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
import { palette } from "theme/palette";
import { Analytics } from "utils/analytics";
import {
  chainToSupportedChainGoalContractAddress,
  chainToSupportedChainId,
} from "utils/chains";
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

/**
 * Dialog to post a proof to a goal.
 */
export default function GoalPostProofDialog(props: {
  id: string;
  onSuccess?: Function;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();
  const { showToastSuccess, showToastError } = useToasts();

  /**
   * Dialog states
   */
  const [isOpen, setIsOpen] = useState(!props.isClose);

  /**
   * Form states
   */
  const [submittedFormDataUri, setSubmittedFormDataUri] = useState("");

  /**
   * Contract states
   */
  const { config: contractPrepareConfig } = usePrepareContractWrite({
    address: chainToSupportedChainGoalContractAddress(chain),
    abi: goalContractAbi,
    functionName: "postProof",
    args: [BigNumber.from(props.id), submittedFormDataUri],
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
   * Close dialog
   */
  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  /**
   * Write data to contract if form was submitted
   */
  useEffect(() => {
    if (submittedFormDataUri && contractWrite && !isContractWriteLoading) {
      contractWrite?.();
      setSubmittedFormDataUri("");
    }
  }, [submittedFormDataUri, contractWrite, isContractWriteLoading]);

  /**
   * Handle transaction success to show success message
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Proof is posted and will appear soon");
      Analytics.postedProof(props.id, chain?.id);
      props.onSuccess?.();
      close();
    }
  }, [isTransactionSuccess]);

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogCenterContent>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          👀 Post proof
        </Typography>
        <Typography textAlign="center" mt={1}>
          that you have achieved your goal or are on your way to it. It can be a
          screenshot, photo, video or any other file
        </Typography>
        <TextAttachmentForm
          isLoading={isContractWriteLoading || isTransactionLoading}
          isDisabled={
            Boolean(submittedFormDataUri) ||
            isContractWriteLoading ||
            isTransactionLoading ||
            isTransactionSuccess
          }
          isSubmittingDisabled={!contractWrite}
          isAttachmentRequired={true}
          onSubmit={(submittedFormDataUri) =>
            setSubmittedFormDataUri(submittedFormDataUri)
          }
          textColor={palette.yellow}
          textPlaceholder="This video demonstrates how..."
          attachmentColor={palette.orange}
          sx={{ mt: 4 }}
        />
      </DialogCenterContent>
    </Dialog>
  );
}
