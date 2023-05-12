import { Box, Dialog, Link as MuiLink, Typography } from "@mui/material";
import FormikHelper from "components/helper/FormikHelper";
import {
  DialogCenterContent,
  ExtraLargeLoadingButton,
  WidgetBox,
  WidgetInputTextField,
  WidgetTitle
} from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import GoalMessageUriDataEntity from "entities/uri/GoalMessageUriDataEntity";
import { BigNumber } from "ethers";
import { Form, Formik } from "formik";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import useToasts from "hooks/useToast";
import Link from "next/link";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { palette } from "theme/palette";
import { isAddressesEqual } from "utils/addresses";
import { Analytics } from "utils/analytics";
import {
  chainToSupportedChainGoalContractAddress,
  chainToSupportedChainId
} from "utils/chains";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction
} from "wagmi";
import * as yup from "yup";

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
  const { handleError } = useError();
  const { showToastSuccess, showToastError } = useToasts();
  const { uploadJsonToIpfs, uploadFileToIpfs } = useIpfs();

  // Dialog states
  const [isOpen, setIsOpen] = useState(!props.isClose);

  // Form states
  const [formAttachmentValue, setFormAttachmentValue] = useState<{
    file: any;
    uri: any;
    isImage: boolean;
    isVideo: boolean;
  }>();
  const [formValues, setFormValues] = useState({
    text: "",
  });
  const formValidationSchema = yup.object({
    text: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Uploaded data states
  const [uploadedMessageDataUri, setUploadedMessageDataUri] = useState("");

  // Contract states
  const { config: contractPrepareConfig } = usePrepareContractWrite({
    address: chainToSupportedChainGoalContractAddress(chain),
    abi: goalContractAbi,
    functionName: "postMessage",
    args: [BigNumber.from(props.id), uploadedMessageDataUri],
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
        if (fileReader.readyState === 2) {
          setFormAttachmentValue({
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

  async function uploadData(values: any) {
    try {
      setIsFormSubmitting(true);
      // Upload attachment to ipfs
      let attachmentUri;
      if (formAttachmentValue?.file) {
        attachmentUri = (await uploadFileToIpfs(formAttachmentValue.file)).uri;
      }
      // Upload message to ipfs
      const messageData: GoalMessageUriDataEntity = {
        text: values.text,
        ...(formAttachmentValue?.file && {
          attachment: {
            type: formAttachmentValue.isImage
              ? "IMAGE"
              : formAttachmentValue.isVideo
              ? "VIDEO"
              : "FILE",
            addedData: new Date().getTime(),
            uri: attachmentUri,
          },
        }),
      };
      const { uri: messageDataUri } = await uploadJsonToIpfs(messageData);
      setUploadedMessageDataUri(messageDataUri);
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  /**
   * Write data to contract if data is uploaded and contract is ready.
   */
  useEffect(() => {
    if (
      uploadedMessageDataUri !== "" &&
      contractWrite &&
      !isContractWriteLoading
    ) {
      setUploadedMessageDataUri("");
      contractWrite?.();
      setIsFormSubmitting(false);
    }
  }, [uploadedMessageDataUri, contractWrite, isContractWriteLoading]);

  /**
   * Handle transaction success to show success message.
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
        <Formik
          initialValues={formValues}
          validationSchema={formValidationSchema}
          onSubmit={uploadData}
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
              <WidgetBox bgcolor={palette.blue} mt={2}>
                <WidgetTitle>Text</WidgetTitle>
                <WidgetInputTextField
                  id="text"
                  name="text"
                  placeholder={
                    isAddressesEqual(address, props.authorAddress)
                      ? "Who can tell me how to..."
                      : "Your goal is great..."
                  }
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
