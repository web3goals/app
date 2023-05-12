import { useCreateAsset } from "@livepeer/react";
import { Box, Dialog, Typography } from "@mui/material";
import FormikHelper from "components/helper/FormikHelper";
import {
  DialogCenterContent,
  ExtraLargeLoadingButton,
  WidgetBox,
  WidgetInputTextField,
  WidgetTitle,
} from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import ProofUriDataEntity from "entities/uri/ProofUriDataEntity";
import { BigNumber } from "ethers";
import { Form, Formik } from "formik";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
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
import * as yup from "yup";

/**
 * Dialog to post a proof to a goal.
 *
 * TODO: Create and use component AttachmentForm.tsx
 * TODO: Display livepeer progress bar, example - https://docs.livepeer.org/guides/developing/upload-a-video-asset
 */
export default function GoalPostProofDialog(props: {
  id: string;
  onSuccess?: Function;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const { showToastSuccess, showToastError } = useToasts();
  const { uploadFileToIpfs, uploadJsonToIpfs } = useIpfs();

  // Dialog states
  const [isOpen, setIsOpen] = useState(!props.isClose);

  // Form states
  const [formAttachmentValue, setFormAttachmentValue] = useState<
    | {
        file: File;
        uri: string;
        isImage: boolean;
        isVideo: boolean;
      }
    | undefined
  >();
  const [formValues, setFormValues] = useState({
    text: "",
  });
  const formValidationSchema = yup.object({
    text: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Livepeer states
  const {
    mutate: createLivepeerAsset,
    data: livepeerAsset,
    status: livepeerStatus,
    progress: livepeerProgress,
    error: livepeerError,
  } = useCreateAsset(
    formAttachmentValue?.file
      ? {
          sources: [
            {
              name: formAttachmentValue.file.name,
              file: formAttachmentValue.file,
            },
          ] as const,
        }
      : null
  );

  // Uploaded data states
  const [uploadedAttachmentUri, setUploadedAttachmentUri] = useState("");
  const [uploadedProofDataUri, setUpdatedProofDataUri] = useState("");

  // Contract states
  const { config: contractPrepareConfig } = usePrepareContractWrite({
    address: chainToSupportedChainGoalContractAddress(chain),
    abi: goalContractAbi,
    functionName: "postProof",
    args: [BigNumber.from(props.id), uploadedProofDataUri],
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

  const isFormDisabled =
    isFormSubmitting ||
    isContractWriteLoading ||
    isTransactionLoading ||
    isTransactionSuccess;

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  async function onAttachmentChange(files: any[]) {
    try {
      // Get file
      const file = files?.[0];
      if (!file) {
        return;
      }
      // Read and save file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2 && fileReader.result) {
          setFormAttachmentValue({
            file: file,
            uri: fileReader.result.toString(),
            isImage: file.type === "image/jpeg" || file.type === "image/png",
            isVideo: file.type === "video/mp4",
          });
        }
      };
      fileReader.readAsDataURL(file);
    } catch (error: any) {
      handleError(error, true);
    }
  }

  // Process submitted form
  async function submit() {
    try {
      setIsFormSubmitting(true);
      // Check file
      if (!formAttachmentValue) {
        throw new Error("Please attach your proof");
      }
      // Upload attachment to livepeer or to ipfs
      if (formAttachmentValue.isVideo) {
        createLivepeerAsset?.();
      } else {
        const { uri } = await uploadFileToIpfs(formAttachmentValue.file);
        setUploadedAttachmentUri(uri);
      }
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  // Upload proof to ipfs when attachment is uploaded to ipfs or to livepeer
  useEffect(() => {
    let proofData: ProofUriDataEntity | undefined = undefined;
    // Define proof data if attachment uploaded to ipfs
    if (formAttachmentValue && uploadedAttachmentUri) {
      proofData = {
        text: formValues.text,
        attachment: {
          type: formAttachmentValue.isImage
            ? "IMAGE"
            : formAttachmentValue.isVideo
            ? "VIDEO"
            : "FILE",
          addedData: new Date().getTime(),
          uri: uploadedAttachmentUri,
        },
      };
    }
    // Define proof data if attachment uploaded to livepeer
    if (formAttachmentValue && livepeerAsset) {
      proofData = {
        text: formValues.text,
        attachment: {
          type: "LIVEPEER_VIDEO",
          addedData: new Date().getTime(),
          livepeerPlaybackId: livepeerAsset[0].playbackId,
        },
      };
    }
    // Upload proof data to ipfs if defined
    if (proofData) {
      uploadJsonToIpfs(proofData)
        .then((result) => {
          setUpdatedProofDataUri(result.uri);
        })
        .catch((error) => {
          handleError(error, true);
          setIsFormSubmitting(false);
        });
    }
  }, [formAttachmentValue, uploadedAttachmentUri, livepeerAsset]);

  // Write data to contract if form was submitted.
  useEffect(() => {
    if (uploadedProofDataUri && contractWrite && !isContractWriteLoading) {
      contractWrite?.();
      setUpdatedProofDataUri("");
      setIsFormSubmitting(false);
    }
  }, [uploadedProofDataUri, contractWrite, isContractWriteLoading]);

  // Handle transaction success to show success message.
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
        <Formik
          initialValues={formValues}
          validationSchema={formValidationSchema}
          onSubmit={submit}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FormikHelper onChange={(values: any) => setFormValues(values)} />
              {/* Text input */}
              <WidgetBox bgcolor={palette.yellow} mt={4}>
                <WidgetTitle>Text</WidgetTitle>
                <WidgetInputTextField
                  id="text"
                  name="text"
                  placeholder="This video demonstrates how..."
                  value={values.text}
                  onChange={handleChange}
                  error={touched.text && Boolean(errors.text)}
                  helperText={touched.text && errors.text}
                  disabled={isFormDisabled}
                  multiline
                  maxRows={4}
                  sx={{ width: 1 }}
                />
              </WidgetBox>
              {/* Attachment input */}
              <WidgetBox bgcolor={palette.orange} mt={2} sx={{ width: 1 }}>
                <WidgetTitle>Attachment</WidgetTitle>
                <Dropzone
                  multiple={false}
                  disabled={isFormDisabled}
                  onDrop={(files) => onAttachmentChange(files)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Box
                        sx={{
                          cursor: !isFormDisabled ? "pointer" : undefined,
                          bgcolor: "#FFFFFF",
                          py: 2,
                          px: 2,
                          borderRadius: 3,
                        }}
                      >
                        <Typography
                          color="text.disabled"
                          sx={{ lineBreak: "anywhere" }}
                        >
                          {formAttachmentValue?.file?.name ||
                            "Drag 'n' drop some files here, or click to select files"}
                        </Typography>
                      </Box>
                    </div>
                  )}
                </Dropzone>
              </WidgetBox>
              {/* Submit button */}
              <ExtraLargeLoadingButton
                loading={
                  isFormSubmitting ||
                  isContractWriteLoading ||
                  isTransactionLoading
                }
                variant="outlined"
                type="submit"
                disabled={isFormDisabled || !contractWrite}
                sx={{ mt: 2 }}
              >
                Submit
              </ExtraLargeLoadingButton>
            </Form>
          )}
        </Formik>
      </DialogCenterContent>
    </Dialog>
  );
}
