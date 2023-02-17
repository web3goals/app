import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import { FullWidthSkeleton, XxlLoadingButton } from "components/styled";
import WidgetBox from "components/widget/WidgetBox";
import {
  VERIFICATION_DATA_KEYS,
  VERIFICATION_REQUIREMENTS,
} from "constants/verifiers";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { palette } from "theme/palette";
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
  const { handleError } = useError();
  const { showToastSuccess, showToastError } = useToasts();
  const { uploadFileToIpfs } = useIpfs();

  // Form values
  const [formValues, setFormValues] = useState<{
    proof?: { file: any; uri: any };
  }>();

  // Verification data states
  const [isVerificationDataLoading, setIsVerificationDataLoading] =
    useState(false);
  const [isVerificationDataReady, setIsVerificationDataReady] = useState(false);
  const [verificationData, setVerificationData] = useState<{
    keys: Array<string>;
    values: Array<string>;
  }>({ keys: [], values: [] });

  // Contract states
  const { config: contractPrepareConfig } = usePrepareContractWrite({
    address: getGoalContractAddress(chain),
    abi: goalContractAbi,
    functionName: "addVerificationDataAndVerify",
    args: [
      BigNumber.from(props.id),
      verificationData.keys,
      verificationData.values,
    ],
    chainId: getChainId(chain),
    onError(error: any) {
      showToastError(error);
    },
    enabled: isVerificationDataReady,
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
    isVerificationDataLoading ||
    isVerificationDataReady ||
    isContractWriteLoading ||
    isTransactionLoading;
  const isFormDisabled = isFormLoading || isTransactionSuccess;

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
      // Read and save file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          setFormValues({
            proof: {
              file: file,
              uri: fileReader.result,
            },
          });
        }
      };
      fileReader.readAsDataURL(file);
    } catch (error: any) {
      handleError(error, true);
    }
  }

  async function prepareVerificationData() {
    try {
      setIsVerificationDataReady(false);
      setIsVerificationDataLoading(true);
      if (
        props.verificationRequirement === VERIFICATION_REQUIREMENTS.anyProofUri
      ) {
        if (!formValues?.proof) {
          throw new Error("Proof file is not attached!");
        }
        const { uri } = await uploadFileToIpfs(formValues.proof.file);
        setVerificationData({
          keys: [VERIFICATION_DATA_KEYS.anyProofUri],
          values: [uri],
        });
      }
      setIsVerificationDataReady(true);
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsVerificationDataLoading(false);
    }
  }

  /**
   * Write data to contract if verification data and contract is ready.
   */
  useEffect(() => {
    if (isVerificationDataReady && contractWrite && !isContractWriteLoading) {
      contractWrite?.();
      setIsVerificationDataReady(false);
      setVerificationData({ keys: [], values: [] });
    }
  }, [isVerificationDataReady, contractWrite, isContractWriteLoading]);

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
      <Typography fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
        verify the achievement of the goal before closing it
      </Typography>
      {/* Proof file input */}
      {props.verificationRequirement ===
        VERIFICATION_REQUIREMENTS.anyProofUri && (
        <WidgetBox title="Proof" color={palette.green} sx={{ width: 1, mb: 3 }}>
          {/* TODO: Move the dropzone to a separate component  */}
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
                    {formValues?.proof?.file?.name ||
                      "Drag 'n' drop some files here, or click to select files"}
                  </Typography>
                </Box>
              </div>
            )}
          </Dropzone>
        </WidgetBox>
      )}
      {/* Button */}
      <XxlLoadingButton
        loading={isFormLoading}
        variant="contained"
        type="submit"
        disabled={isFormDisabled}
        onClick={() => prepareVerificationData()}
      >
        Verify
      </XxlLoadingButton>
    </>
  );
}

function GoalCloseForm(props: {
  id: string;
  isVerificationStatusAchieved: boolean;
  onSuccess?: Function;
}) {
  const { chain } = useNetwork();
  const { showToastSuccess } = useToasts();

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "close",
      args: [BigNumber.from(props.id)],
      chainId: getChainId(chain),
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
      <Typography fontWeight={700} textAlign="center" sx={{ mb: 3 }}>
        {props.isVerificationStatusAchieved
          ? "the goal is verified as achieved, now it can be closed"
          : "the goal is not achieved by the deadline, so it can only be closed as a failed"}
      </Typography>
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
      <Typography fontWeight={700} textAlign="center">
        {props.isVerificationStatusAchieved
          ? "the stake will be returned after closing"
          : "the stake will be shared between watchers and application after closing"}
      </Typography>
    </>
  );
}
