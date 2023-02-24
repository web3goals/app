import { useCreateAsset } from "@livepeer/react";
import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import {
  FullWidthSkeleton,
  WidgetBox,
  WidgetSeparatorText,
  WidgetTitle,
  XxlLoadingButton,
} from "components/styled";
import {
  VERIFICATION_DATA_KEYS,
  VERIFICATION_REQUIREMENTS,
} from "constants/verifiers";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import useToasts from "hooks/useToast";
import { useEffect, useMemo, useState } from "react";
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
    proof?: { file: any; uri: any; isVideo: boolean };
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

  // Livepeer create asset states
  const {
    mutate: createAsset,
    data: asset,
    status: createAssetStatus,
    progress: createAssetProgress,
  } = useCreateAsset(
    formValues?.proof?.isVideo
      ? {
          sources: [
            { name: formValues.proof.file.name, file: formValues.proof.file },
          ] as const,
        }
      : null
  );
  const createAssetProgressFormatted = useMemo(
    () =>
      createAssetProgress?.[0].phase === "failed"
        ? "failed to process video"
        : createAssetProgress?.[0].phase === "waiting"
        ? "waiting"
        : createAssetProgress?.[0].phase === "uploading"
        ? `uploading: ${Math.round(createAssetProgress?.[0]?.progress * 100)}%`
        : createAssetProgress?.[0].phase === "processing"
        ? `processing: ${Math.round(createAssetProgress?.[0].progress * 100)}%`
        : null,
    [createAssetProgress]
  );

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
      // Read and save file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          setFormValues({
            proof: {
              file: file,
              uri: fileReader.result,
              isVideo: file.type === "video/mp4",
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
      // If any proof requirement
      if (
        props.verificationRequirement === VERIFICATION_REQUIREMENTS.anyProof
      ) {
        if (!formValues?.proof) {
          throw new Error("Proof file is not attached!");
        }
        // Upload to livepeer if file is video
        if (formValues.proof.isVideo) {
          createAsset?.();
        }
        // Upload to ipfs if file is not video
        else {
          const { uri } = await uploadFileToIpfs(formValues.proof.file);
          setVerificationData({
            keys: [VERIFICATION_DATA_KEYS.anyUri],
            values: [uri],
          });
          setIsVerificationDataReady(true);
          setIsVerificationDataLoading(false);
        }
      }
      // If github activity requirement
      if (
        props.verificationRequirement ===
        VERIFICATION_REQUIREMENTS.gitHubActivity
      ) {
        setVerificationData({ keys: [], values: [] });
        setIsVerificationDataReady(true);
        setIsVerificationDataLoading(false);
      }
    } catch (error: any) {
      handleError(error, true);
      setIsVerificationDataLoading(false);
    }
  }

  /**
   * Update veirifcation data when video uploaded to livepeer.
   */
  useEffect(() => {
    if (createAssetStatus === "success" && asset) {
      setVerificationData({
        keys: [VERIFICATION_DATA_KEYS.anyLivepeerPlaybackId],
        values: [asset[0].playbackId || ""],
      });
      setIsVerificationDataReady(true);
      setIsVerificationDataLoading(false);
    }
  }, [createAssetStatus]);

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
      <WidgetSeparatorText mb={2}>
        verify the achievement of the goal before closing it
      </WidgetSeparatorText>
      {/* Proof file input */}
      {props.verificationRequirement === VERIFICATION_REQUIREMENTS.anyProof && (
        <WidgetBox bgcolor={palette.green} mb={3} sx={{ width: 1 }}>
          <WidgetTitle>Proof</WidgetTitle>
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
                  <Typography
                    color="text.secondary"
                    sx={{ lineBreak: "anywhere" }}
                  >
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
      {createAssetProgressFormatted && (
        <WidgetSeparatorText mt={3}>
          {createAssetProgressFormatted}
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
      <WidgetSeparatorText>
        {props.isVerificationStatusAchieved
          ? "the stake will be returned after closing"
          : "the stake will be shared between watchers and application after closing"}
      </WidgetSeparatorText>
    </>
  );
}
