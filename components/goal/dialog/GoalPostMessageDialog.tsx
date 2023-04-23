import { Dialog, Typography, Link as MuiLink } from "@mui/material";
import FormikHelper from "components/helper/FormikHelper";
import {
  DialogCenterContent,
  ExtraLargeLoadingButton,
  WidgetBox,
  WidgetInputTextField,
  WidgetTitle,
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
import { palette } from "theme/palette";
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
  const { uploadJsonToIpfs } = useIpfs();

  // Dialog states
  const [isOpen, setIsOpen] = useState(!props.isClose);

  // Form states
  const [formValues, setFormValues] = useState({
    text: "",
  });
  const formValidationSchema = yup.object({
    text: yup.string().required(),
  });

  // Uploaded data states
  const [uploadedMessageDataUri, setUploadedMessageDataUri] = useState("");
  const [isDataUploading, setIsDataUploading] = useState(false);

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
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
      const messageData: GoalMessageUriDataEntity = {
        text: values.text,
      };
      const { uri: messageDataUri } = await uploadJsonToIpfs(messageData);
      setUploadedMessageDataUri(messageDataUri);
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
            to motivate or help the author, earn a reputation as an
            inspirational person, and participate in the{" "}
            <Link href={"/#faq-how-stake-is-shared"} passHref legacyBehavior>
              <MuiLink>sharing</MuiLink>
            </Link>{" "}
            of the stake if the goal fail
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
                    address === props.authorAddress
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
              {/* Submit button */}
              <ExtraLargeLoadingButton
                loading={isFormLoading}
                variant="outlined"
                type="submit"
                disabled={isFormSubmitButtonDisabled}
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
