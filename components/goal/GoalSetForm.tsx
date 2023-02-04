import { Box, MenuItem, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import FormikHelper from "components/helper/FormikHelper";
import {
  CentralizedBox,
  WidgetInputSelect,
  WidgetInputTextField,
  XxlLoadingButton,
} from "components/styled";
import WidgetBox from "components/widget/WidgetBox";
import { goalContractAbi } from "contracts/abi/goalContract";
import GoalUriDataEntity from "entities/GoalUriDataEntity";
import { ethers } from "ethers";
import { Form, Formik } from "formik";
import useDebounce from "hooks/useDebounce";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
import { palette } from "theme/palette";
import {
  dateToBigNumberTimestamp,
  numberToBigNumberEthers,
  stringToAddress,
} from "utils/converters";
import { getContractsChain } from "utils/network";
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import * as yup from "yup";

/**
 * A component with form to set a goal.
 */
export default function GoalSetForm(props: {
  onSuccessSet: (id: string) => void;
}) {
  const { address } = useAccount();
  const { handleError } = useError();
  const { showToastError } = useToasts();
  const { uploadJsonToIpfs } = useIpfs();

  // Form states
  const [formValues, setFormValues] = useState({
    description: "Code everyday for 100 days",
    stake: 0.01,
    stakeCurrency: "native",
    deadline: "2023-03-01",
  });
  const formValidationSchema = yup.object({
    description: yup.string().required(),
    stake: yup.number().required(),
    stakeCurrency: yup.string().required(),
    deadline: yup.string().required(),
  });
  const debouncedFormValues = useDebounce(formValues);

  // Uploaded data states
  const [uploadedGoalDataUri, setUploadedGoalDataUri] = useState("");
  const [isDataUploading, setIsDataUploading] = useState(false);

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: stringToAddress(process.env.NEXT_PUBLIC_GOAL_CONTRACT_ADDRESS),
      abi: goalContractAbi,
      functionName: "set",
      args: [
        uploadedGoalDataUri,
        numberToBigNumberEthers(debouncedFormValues.stake),
        dateToBigNumberTimestamp(debouncedFormValues.deadline),
      ],
      overrides: {
        value: numberToBigNumberEthers(debouncedFormValues.stake),
      },
      chainId: getContractsChain().id,
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

  const isFormLoading =
    isDataUploading || isContractWriteLoading || isTransactionLoading;
  const isFormDisabled = isFormLoading || isTransactionSuccess;
  const isFormSubmitButtonDisabled =
    isFormDisabled || isContractPrepareError || !contractWrite;

  async function uploadData(values: any) {
    try {
      setIsDataUploading(true);
      const goalData: GoalUriDataEntity = {
        description: values.description,
        deadline: values.deadline,
      };
      const { uri: goalDataUri } = await uploadJsonToIpfs(goalData);
      setUploadedGoalDataUri(goalDataUri);
    } catch (error: any) {
      handleError(error, true);
      setIsDataUploading(false);
    }
  }

  /**
   * Listen contract events to get id of set goal.
   */
  useContractEvent({
    address: stringToAddress(process.env.NEXT_PUBLIC_GOAL_CONTRACT_ADDRESS),
    abi: goalContractAbi,
    eventName: "Transfer",
    listener(from, to, tokenId) {
      if (from === ethers.constants.AddressZero && to === address) {
        props.onSuccessSet(tokenId.toString());
      }
    },
  });

  /**
   * Write data to contract if data is uploaded and contract is ready.
   */
  useEffect(() => {
    if (
      uploadedGoalDataUri !== "" &&
      contractWrite &&
      !isContractWriteLoading
    ) {
      setUploadedGoalDataUri("");
      contractWrite?.();
      setIsDataUploading(false);
    }
  }, [uploadedGoalDataUri, contractWrite, isContractWriteLoading]);

  return (
    <CentralizedBox>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        🤝 Dear Web3,
      </Typography>
      <Formik
        initialValues={formValues}
        validationSchema={formValidationSchema}
        onSubmit={uploadData}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form style={{ width: "100%" }}>
            <FormikHelper onChange={(values: any) => setFormValues(values)} />
            {/* Description input */}
            <WidgetBox title="My goal is" color={palette.blue} sx={{ mb: 2 }}>
              <WidgetInputTextField
                id="description"
                name="description"
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
            {/* Text divider */}
            <Typography fontWeight={700} textAlign="center" sx={{ mb: 3 }}>
              and
            </Typography>
            {/* Stake input */}
            <WidgetBox title="I stake" color={palette.red} sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} sx={{ width: 1 }}>
                <WidgetInputTextField
                  id="stake"
                  name="stake"
                  type="number"
                  value={values.stake}
                  onChange={handleChange}
                  error={touched.stake && Boolean(errors.stake)}
                  helperText={touched.stake && errors.stake}
                  disabled={isFormDisabled}
                  sx={{ flex: 1 }}
                />
                <WidgetInputSelect
                  id="stakeCurrency"
                  name="stakeCurrency"
                  value={values.stakeCurrency}
                  onChange={handleChange}
                  disabled={isFormDisabled}
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="native">
                    {getContractsChain().nativeCurrency?.symbol}
                  </MenuItem>
                </WidgetInputSelect>
              </Stack>
            </WidgetBox>
            {/* Text divider */}
            <Typography fontWeight={700} textAlign="center" sx={{ mb: 3 }}>
              on achieving it
            </Typography>
            {/* Deadline input */}
            <WidgetBox title="On" color={palette.purpleDark} sx={{ mb: 3 }}>
              <WidgetInputTextField
                id="deadline"
                name="deadline"
                type="date"
                value={values.deadline}
                onChange={handleChange}
                error={touched.deadline && Boolean(errors.deadline)}
                helperText={touched.deadline && errors.deadline}
                disabled={isFormDisabled}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* Text divider */}
            <Typography fontWeight={700} textAlign="center" sx={{ mb: 3 }}>
              otherwise the stake will be shared between watchers and
              application
            </Typography>
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
                Set Goal
              </XxlLoadingButton>
            </Box>
          </Form>
        )}
      </Formik>
    </CentralizedBox>
  );
}
