import { Dialog, Link as MuiLink, Typography } from "@mui/material";
import TextAttachmentForm from "components/form/TextAttachmentForm";
import { DialogCenterContent } from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import useToasts from "hooks/useToast";
import Link from "next/link";
import { useEffect, useState } from "react";
import { palette } from "theme/palette";
import { isAddressesEqual } from "utils/addresses";
import { Analytics } from "utils/analytics";
import {
  chainToSupportedChainGoalContractAddress,
  chainToSupportedChainId,
} from "utils/chains";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

/**
 * Dialog to post a message to a goal.
 */
export default function GoalPostMessageDialog(props: {
  id: string;
  authorAddress: string;
  onSuccess?: Function;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();
  const { address } = useAccount();
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
    functionName: "postMessage",
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
      showToastSuccess("Message is posted and will appear soon");
      Analytics.postedMessage(props.id, chain?.id);
      props.onSuccess?.();
      close();
    }
  }, [isTransactionSuccess]);

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogCenterContent>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          ✍️ Post message
        </Typography>
        {address !== props.authorAddress && (
          <Typography textAlign="center" mt={1} mb={2}>
            to motivate or help the author and earn a{" "}
            <Link href={"/#faq-what-is-reputation"} passHref legacyBehavior>
              <MuiLink>reputation</MuiLink>
            </Link>{" "}
            as an inspirational person
          </Typography>
        )}
        <TextAttachmentForm
          isLoading={
            Boolean(submittedFormDataUri) ||
            isContractWriteLoading ||
            isTransactionLoading
          }
          isDisabled={
            Boolean(submittedFormDataUri) ||
            isContractWriteLoading ||
            isTransactionLoading ||
            isTransactionSuccess
          }
          isSubmittingDisabled={!contractWrite}
          isAttachmentRequired={false}
          onSubmit={(submittedFormDataUri) =>
            setSubmittedFormDataUri(submittedFormDataUri)
          }
          textColor={palette.blue}
          textPlaceholder={
            isAddressesEqual(address, props.authorAddress)
              ? "Who can tell me how to..."
              : "Your goal is great..."
          }
          attachmentColor={palette.purpleDark}
          sx={{ mt: 2 }}
        />
      </DialogCenterContent>
    </Dialog>
  );
}
