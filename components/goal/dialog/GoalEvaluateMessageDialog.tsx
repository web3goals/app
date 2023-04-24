import { Dialog, Link as MuiLink, MenuItem, Typography } from "@mui/material";
import FormikHelper from "components/helper/FormikHelper";
import {
  DialogCenterContent,
  ExtraLargeLoadingButton,
  WidgetBox,
  WidgetInputSelect,
  WidgetTitle,
} from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber } from "ethers";
import { Form, Formik } from "formik";
import useDebounce from "hooks/useDebounce";
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
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import * as yup from "yup";

/**
 * Dialog to evaluate a goal message.
 *
 * TODO: Delete "isClose" prop in this and other dialogs?
 */
export default function GoalEvaluateMessageDialog(props: {
  id: string;
  messageId: string;
  onSuccess?: Function;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();
  const { showToastSuccess, showToastError } = useToasts();

  // Dialog states
  const [isOpen, setIsOpen] = useState(!props.isClose);

  // Form states
  const formEvaluations = [
    { value: "isMotivating", description: "⭐ It’s motivating!" },
    { value: "isSuperMotivating", description: "🌟 It’s super motivating!" },
  ];
  const [formValues, setFormValues] = useState({
    evaluation: formEvaluations[0].value,
  });
  const formValidationSchema = yup.object({
    evaluation: yup.string().required(),
  });
  const debouncedFormValues = useDebounce(formValues);

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: chainToSupportedChainGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "evaluateMessage",
      args: [
        BigNumber.from(props.id),
        BigNumber.from(props.messageId),
        debouncedFormValues.evaluation === formEvaluations[0].value,
        debouncedFormValues.evaluation === formEvaluations[1].value,
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

  // Form states
  const isFormLoading = isContractWriteLoading || isTransactionLoading;
  const isFormDisabled = isFormLoading || isTransactionSuccess;
  const isFormSubmitButtonDisabled =
    isFormDisabled || isContractPrepareError || !contractWrite;

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Message is evaluated");
      Analytics.evaluatedMessage(props.id, chain?.id);
      props.onSuccess?.();
      close();
    }
  }, [isTransactionSuccess]);

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogCenterContent>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          🤩 How much
        </Typography>
        <Typography textAlign="center" mt={1}>
          does the message motivate you? Your evaluation will affect the
          person's reputation and how the stake will be shared{" "}
          <Link href={"/#faq-how-stake-is-shared"} passHref legacyBehavior>
            <MuiLink>shared</MuiLink>
          </Link>{" "}
          if the goal fails
        </Typography>
        <Formik
          initialValues={formValues}
          validationSchema={formValidationSchema}
          onSubmit={() => contractWrite?.()}
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
              {/* Evaluation input */}
              <WidgetBox bgcolor={palette.green} mt={4}>
                <WidgetTitle>I think</WidgetTitle>
                <WidgetInputSelect
                  id="evaluation"
                  name="evaluation"
                  value={values.evaluation}
                  onChange={handleChange}
                  disabled={isFormDisabled}
                  sx={{ width: 1 }}
                >
                  <MenuItem value={formEvaluations[0].value}>
                    {formEvaluations[0].description}
                  </MenuItem>
                  <MenuItem value={formEvaluations[1].value}>
                    {formEvaluations[1].description}
                  </MenuItem>
                </WidgetInputSelect>
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
