import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import FormikHelper from "components/helper/FormikHelper";
import {
  WidgetBox,
  WidgetInputTextField,
  WidgetSeparatorText,
  WidgetTitle,
  ExtraLargeLoadingButton,
} from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import GoalMotivatorUriDataEntity from "entities/uri/GoalMotivatorUriDataEntity";
import { BigNumber } from "ethers";
import { Form, Formik } from "formik";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
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
 * Dialog to become a motivator of a goal.
 */
export default function GoalBecomeMotivatorDialog(props: {
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
    message: "Your goal is great…",
  });
  const formValidationSchema = yup.object({
    message: yup.string().required(),
  });

  // Uploaded data states
  const [uploadedMotivatorDataUri, setUploadedMotivatorDataUri] = useState("");
  const [isDataUploading, setIsDataUploading] = useState(false);

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: chainToSupportedChainGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "becomeMotivator",
      args: [BigNumber.from(props.id), uploadedMotivatorDataUri],
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
      const motivatorData: GoalMotivatorUriDataEntity = {
        message: values.message,
      };
      const { uri: motivatorDataUri } = await uploadJsonToIpfs(motivatorData);
      setUploadedMotivatorDataUri(motivatorDataUri);
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
      uploadedMotivatorDataUri !== "" &&
      contractWrite &&
      !isContractWriteLoading
    ) {
      setUploadedMotivatorDataUri("");
      contractWrite?.();
      setIsDataUploading(false);
    }
  }, [uploadedMotivatorDataUri, contractWrite, isContractWriteLoading]);

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Your message is posted and will appear soon");
      Analytics.postedMotivationalMessage(props.id, chain?.id);
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
          ✨ To become a motivator
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
                you should post a message that motivates the author of the goal
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
                  mb: 3,
                }}
              >
                <ExtraLargeLoadingButton
                  loading={isFormLoading}
                  variant="contained"
                  type="submit"
                  disabled={isFormSubmitButtonDisabled}
                >
                  Post
                </ExtraLargeLoadingButton>
              </Box>
              <WidgetSeparatorText px={{ md: 12 }} color="text.secondary">
                🔮 once published, the author will be able to accept your
                candidacy
              </WidgetSeparatorText>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
