import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import FormikHelper from "components/helper/FormikHelper";
import {
  WidgetBox,
  WidgetInputTextField,
  CenterBoldText,
  WidgetTitle,
  ExtraLargeLoadingButton,
} from "components/styled";
import {
  VERIFICATION_DATA_KEYS,
  VERIFICATION_REQUIREMENTS,
} from "constants/verifiers";
import { goalContractAbi } from "contracts/abi/goalContract";
import ProofDocumentsUriDataEntity from "entities/uri/ProofDocumentsUriDataEntity";
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
  chainToSupportedChainId,
  chainToSupportedChainGoalContractAddress,
} from "utils/chains";
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import * as yup from "yup";

/**
 * Dialog to add document to proof documents.
 */
export default function GoalAddProofDocumentDialog(props: {
  id: string;
  verificationRequirement: string;
  proofDocuments: ProofDocumentsUriDataEntity;
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

  // Form values
  const [formFileValue, setFormFileValue] = useState<{
    file: any;
    uri: any;
    isImage: boolean;
    isVideo: boolean;
  }>();
  const [formValues, setFormValues] = useState({
    description: "",
  });
  const formValidationSchema = yup.object({
    description: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Uri states
  const [updatedProofDocumentsDataUri, setUpdatedProofDocumentsDataUri] =
    useState("");

  // Contract states
  const { config: contractPrepareConfig } = usePrepareContractWrite({
    address: chainToSupportedChainGoalContractAddress(chain),
    abi: goalContractAbi,
    functionName: "addVerificationData",
    args: [
      BigNumber.from(props.id),
      [
        props.verificationRequirement === VERIFICATION_REQUIREMENTS.anyProofUri
          ? VERIFICATION_DATA_KEYS.anyProofUri
          : VERIFICATION_DATA_KEYS.undefined,
      ],
      [updatedProofDocumentsDataUri],
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

  const isFormDisabled =
    isFormSubmitting ||
    isContractWriteLoading ||
    isTransactionLoading ||
    isTransactionSuccess;

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
      // Read and save file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          setFormFileValue({
            file: file,
            uri: fileReader.result,
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

  async function submit(values: any) {
    try {
      setIsFormSubmitting(true);
      // Check file
      if (!formFileValue?.file) {
        throw new Error("File is not attached");
      }
      // Upload file to ipfs
      const { uri: fileUri } = await uploadFileToIpfs(formFileValue.file);
      // Add file to proof documents
      const proofDocumentsUriData: ProofDocumentsUriDataEntity = {
        documents: [
          ...props.proofDocuments.documents,
          {
            description: values.description,
            type: formFileValue.isImage
              ? "IMAGE"
              : formFileValue.isVideo
              ? "VIDEO"
              : "FILE",
            addedData: new Date().getTime(),
            uri: fileUri,
          },
        ],
      };
      // Upload proof documents to ipfs
      const { uri: proofDocumentsUri } = await uploadJsonToIpfs(
        proofDocumentsUriData
      );
      setUpdatedProofDocumentsDataUri(proofDocumentsUri);
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  /**
   * Write data to contract if form was submitted.
   */
  useEffect(() => {
    if (
      updatedProofDocumentsDataUri !== "" &&
      contractWrite &&
      !isContractWriteLoading
    ) {
      contractWrite?.();
      setUpdatedProofDocumentsDataUri("");
      setIsFormSubmitting(false);
    }
  }, [updatedProofDocumentsDataUri, contractWrite, isContractWriteLoading]);

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Proof is added and will appear soon");
      Analytics.addedProof(props.id, chain?.id);
      props.onSuccess?.();
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
        <Typography variant="h4" fontWeight={700} textAlign="center">
          📃 Add proof
        </Typography>
        <CenterBoldText mt={2} mb={4}>
          it can be a screenshot, photo, video or any other file
        </CenterBoldText>
        {/* Name input */}
        <Formik
          initialValues={formValues}
          validationSchema={formValidationSchema}
          onSubmit={submit}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form style={{ width: "100%" }}>
              <FormikHelper onChange={(values: any) => setFormValues(values)} />
              {/* Description */}
              <WidgetBox bgcolor={palette.purpleLight}>
                <WidgetTitle>Description</WidgetTitle>
                <WidgetInputTextField
                  id="description"
                  name="description"
                  placeholder="Photo from…"
                  value={values.description}
                  onChange={handleChange}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  disabled={isFormDisabled}
                  multiline
                  maxRows={4}
                  sx={{ width: 1 }}
                />
              </WidgetBox>
              {/* File */}
              <WidgetBox bgcolor={palette.purpleDark} mt={2} sx={{ width: 1 }}>
                <WidgetTitle>File</WidgetTitle>
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
                          px: 2,
                          borderRadius: 3,
                        }}
                      >
                        <Typography
                          color="text.disabled"
                          sx={{ lineBreak: "anywhere" }}
                        >
                          {formFileValue?.file?.name ||
                            "Drag 'n' drop some files here, or click to select files"}
                        </Typography>
                      </Box>
                    </div>
                  )}
                </Dropzone>
              </WidgetBox>
              {/* Submit button */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mt={4}
              >
                <ExtraLargeLoadingButton
                  loading={
                    isFormSubmitting ||
                    isContractWriteLoading ||
                    isTransactionLoading
                  }
                  variant="contained"
                  type="submit"
                  disabled={isFormDisabled || !contractWrite}
                >
                  Add
                </ExtraLargeLoadingButton>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
