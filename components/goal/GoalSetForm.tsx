import { Autocomplete, Box, MenuItem, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import FormikHelper from "components/helper/FormikHelper";
import {
  CentralizedBox,
  WidgetBox,
  WidgetInputSelect,
  WidgetInputTextField,
  WidgetSeparatorText,
  WidgetTitle,
  XxlLoadingButton,
} from "components/styled";
import {
  VERIFICATION_DATA_KEYS,
  VERIFICATION_REQUIREMENTS,
} from "constants/verifiers";
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
  getChainId,
  getChainNativeCurrencySymbol,
  getGoalContractAddress,
} from "utils/chains";
import {
  dateStringToBigNumberTimestamp,
  numberToBigNumberEthers,
} from "utils/converters";
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  useNetwork,
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
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { handleError } = useError();
  const { showToastError } = useToasts();
  const { uploadJsonToIpfs } = useIpfs();

  const goalExamples = [
    "Complete the challenge #14DaysOfCode",
    "Reach 1,000 followers",
    "Read 12 books",
    "Train every week for 3 months",
    "Go with the family to Spain",
    "Conquer the peak of Kilimanjaro",
  ];

  // Form states
  const [formValues, setFormValues] = useState({
    description: "",
    stake: 0.01,
    stakeCurrency: "native",
    deadline: "2023-03-01",
    verificationRequirement: VERIFICATION_REQUIREMENTS.anyProof,
  });
  const formValidationSchema = yup.object({
    description: yup.string().required(),
    stake: yup.number().required(),
    stakeCurrency: yup.string().required(),
    deadline: yup.string().required(),
    verificationRequirement: yup.string().required(),
  });
  const debouncedFormValues = useDebounce(formValues);

  // Uploaded data states
  const [uploadedGoalDataUri, setUploadedGoalDataUri] = useState("");
  const [isDataUploading, setIsDataUploading] = useState(false);

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "set",
      args: [
        uploadedGoalDataUri,
        numberToBigNumberEthers(debouncedFormValues.stake),
        dateStringToBigNumberTimestamp(debouncedFormValues.deadline),
        debouncedFormValues.verificationRequirement,
        [],
        [],
      ],
      overrides: {
        value: numberToBigNumberEthers(debouncedFormValues.stake),
      },
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
    address: getGoalContractAddress(chain),
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

  console.log(formValues);

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
        {({ values, errors, touched, handleChange, setValues }) => (
          <Form style={{ width: "100%" }}>
            <FormikHelper onChange={(values: any) => setFormValues(values)} />
            {/* Description input */}
            <WidgetBox bgcolor={palette.blue} mb={3}>
              <WidgetTitle>My goal is</WidgetTitle>
              <Autocomplete
                // TODO: Test that description is updating after change
                onChange={(_, value: string) => {
                  setValues({
                    ...values,
                    description: value,
                  });
                }}
                inputValue={values.description}
                onInputChange={(_, value) => {
                  setValues({
                    ...values,
                    description: value,
                  });
                }}
                freeSolo
                disableClearable
                options={goalExamples.map((example) => example)}
                disabled={isFormDisabled}
                renderInput={(params) => (
                  <WidgetInputTextField
                    {...params}
                    id="description"
                    name="description"
                    placeholder="Train every week..."
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    multiline
                    maxRows={4}
                    sx={{ width: 1 }}
                  />
                )}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            <WidgetSeparatorText mb={3}>and</WidgetSeparatorText>
            {/* Stake input */}
            <WidgetBox bgcolor={palette.red} mb={3}>
              <WidgetTitle>I stake</WidgetTitle>
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
                    {getChainNativeCurrencySymbol(chain)}
                  </MenuItem>
                </WidgetInputSelect>
              </Stack>
            </WidgetBox>
            <WidgetSeparatorText mb={3}>on achieving it</WidgetSeparatorText>
            {/* Deadline input */}
            <WidgetBox bgcolor={palette.purpleDark} mb={3}>
              <WidgetTitle>By</WidgetTitle>
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
            <WidgetSeparatorText mb={3}>
              otherwise the stake will be shared between watchers and
              application
            </WidgetSeparatorText>
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
