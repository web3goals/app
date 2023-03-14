import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import FormikHelper from "components/helper/FormikHelper";
import {
  WidgetBox,
  WidgetInputTextField,
  WidgetSeparatorText,
  WidgetTitle,
  XxlLoadingButton,
} from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import GoalMessageUriDataEntity from "entities/uri/GoalMessageUriDataEntity";
import { BigNumber } from "ethers";
import { Form, Formik } from "formik";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
import { palette } from "theme/palette";
import { getChainId, getGoalContractAddress } from "utils/chains";
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import * as yup from "yup";

/**
 * Dialog to post a message to a goal.
 */
export default function GoalPostMessageDialog(props: {
  id: string;
  onSuccess?: Function;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const { showToastSuccess, showToastError } = useToasts();
  const { uploadJsonToIpfs } = useIpfs();

  // Dialog states
  const [isOpen, setIsOpen] = useState(!props.isClose);

  // Form states
  const [formValues, setFormValues] = useState({
    message: "How's it going...",
  });
  const formValidationSchema = yup.object({
    message: yup.string().required(),
  });

  // Uploaded data states
  const [uploadedMessageDataUri, setUploadedMessageDataUri] = useState("");
  const [isDataUploading, setIsDataUploading] = useState(false);

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "postMessage",
      args: [BigNumber.from(props.id), uploadedMessageDataUri],
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
    isFormDisabled || isContractPrepareError || !contractWrite;

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  async function uploadData(values: any) {
    try {
      setIsDataUploading(true);
      const motivatorData: GoalMessageUriDataEntity = {
        message: values.message,
      };
      const { uri: motivatorDataUri } = await uploadJsonToIpfs(motivatorData);
      setUploadedMessageDataUri(motivatorDataUri);
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
      uploadedMessageDataUri !== "" &&
      contractWrite &&
      !isContractWriteLoading
    ) {
      setUploadedMessageDataUri("");
      contractWrite?.();
      setIsDataUploading(false);
    }
  }, [uploadedMessageDataUri, contractWrite, isContractWriteLoading]);

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Your message posted");
      props.onSuccess?.();
      close();
    }
  }, [isTransactionSuccess]);

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogContent sx={{ my: 2 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: 2 }}
        >
          ✍️ Post message
        </Typography>
        <Formik
          initialValues={formValues}
          validationSchema={formValidationSchema}
          onSubmit={uploadData}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form style={{ width: "100%" }}>
              <FormikHelper onChange={(values: any) => setFormValues(values)} />
              <WidgetSeparatorText mb={3} px={{ md: 12 }}>
                on the way to achieving the goal
              </WidgetSeparatorText>
              {/* Message input */}
              <WidgetBox bgcolor={palette.blue} mb={2}>
                <WidgetTitle>Message</WidgetTitle>
                <WidgetInputTextField
                  id="message"
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  error={touched.message && Boolean(errors.message)}
                  helperText={touched.message && errors.message}
                  disabled={isFormDisabled}
                  multiline
                  maxRows={4}
                  sx={{ width: 1 }}
                />
              </WidgetBox>
              {/* Submit button */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <XxlLoadingButton
                  loading={isFormLoading}
                  variant="contained"
                  type="submit"
                  disabled={isFormSubmitButtonDisabled}
                >
                  Post
                </XxlLoadingButton>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
