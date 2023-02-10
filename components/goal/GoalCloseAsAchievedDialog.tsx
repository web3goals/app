import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import { XxlLoadingButton } from "components/styled";
import WidgetBox from "components/widget/WidgetBox";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { palette } from "theme/palette";
import { getChainId, getGoalContractAddress } from "utils/chains";
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

/**
 * Dialog to close a goal as achieved.
 */
export default function GoalCloseAsAchievedDialog(props: {
  id: string;
  onUpdate?: Function;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const { showToastSuccess, showToastError } = useToasts();
  const { uploadFileToIpfs } = useIpfs();

  // Dialog states
  const [isOpen, setIsOpen] = useState(!props.isClose);

  // Proof states
  const [proofFileValue, setProofFileValue] = useState<{
    file: any;
    uri: any;
  }>();
  const [uploadedProofFileUri, setUploadedProofFileUri] = useState("");
  const [isDataUploading, setIsDataUploading] = useState(false);

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "closeAsAchieved",
      args: [BigNumber.from(props.id), uploadedProofFileUri],
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
  const isFormLoading =
    isDataUploading || isContractWriteLoading || isTransactionLoading;
  const isFormDisabled = isFormLoading || isTransactionSuccess;
  const isFormSubmitButtonDisabled =
    isFormDisabled ||
    isContractPrepareError ||
    !contractWrite ||
    !proofFileValue?.file;

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  async function onProofChange(files: Array<any>) {
    try {
      // Get file
      const file = files?.[0];
      if (!file) {
        return;
      }
      // Check file size
      const isLessThan2Mb = file.size / 1024 / 1024 < 2;
      if (!isLessThan2Mb) {
        throw new Error(
          "Only files with size smaller than 2MB are currently supported!"
        );
      }
      // Read file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          // Save states
          setProofFileValue({
            file: file,
            uri: fileReader.result,
          });
        }
      };
      fileReader.readAsDataURL(file);
    } catch (error: any) {
      handleError(error, true);
    }
  }

  async function uploadData() {
    try {
      setIsDataUploading(true);
      if (!proofFileValue) {
        throw new Error("Proof file is not attached!");
      }
      const { uri: proofFileUri } = await uploadFileToIpfs(proofFileValue.file);
      setUploadedProofFileUri(proofFileUri);
    } catch (error: any) {
      handleError(error, true);
      setIsDataUploading(false);
    }
  }

  /**
   * Write data to contract if data is uploaded and contract is ready.
   */
  useEffect(() => {
    if (
      uploadedProofFileUri !== "" &&
      contractWrite &&
      !isContractWriteLoading
    ) {
      setUploadedProofFileUri("");
      contractWrite?.();
      setIsDataUploading(false);
    }
  }, [uploadedProofFileUri, contractWrite, isContractWriteLoading]);

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Goal is closed as achieved!");
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
        {/* Title */}
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: 2 }}
        >
          🤝 Dear Web3,
        </Typography>
        {/* Text */}
        <Typography
          fontWeight={700}
          textAlign="center"
          sx={{ px: { xs: 0, md: 12 }, mb: 3 }}
        >
          goal is achieved and this is
        </Typography>
        {/* Proof file input */}
        <WidgetBox title="Proof" color={palette.green} sx={{ mb: 3 }}>
          <Dropzone
            multiple={false}
            disabled={isFormDisabled}
            onDrop={(files) => onProofChange(files)}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Box
                  sx={{
                    cursor: !isFormDisabled ? "pointer" : undefined,
                    bgcolor: "#FFFFFF",
                    py: 2,
                    px: 4,
                    borderRadius: 3,
                  }}
                >
                  <Typography color="text.secondary">
                    {proofFileValue?.file
                      ? proofFileValue.file.name
                      : "Drag 'n' drop some files here, or click to select files"}
                  </Typography>
                </Box>
              </div>
            )}
          </Dropzone>
        </WidgetBox>
        {/* Button */}
        <XxlLoadingButton
          loading={isFormLoading}
          variant="contained"
          type="submit"
          disabled={isFormSubmitButtonDisabled}
          onClick={() => uploadData()}
          sx={{ mb: 3 }}
        >
          Close Goal
        </XxlLoadingButton>
        {/* Text */}
        <Typography
          fontWeight={700}
          textAlign="center"
          sx={{ px: { xs: 0, md: 12 } }}
        >
          the stake will be returned after closing
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
