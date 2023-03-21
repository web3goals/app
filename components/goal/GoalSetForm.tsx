import {
  Autocomplete,
  Box,
  Link as MuiLink,
  MenuItem,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
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
import { VERIFICATION_REQUIREMENTS } from "constants/verifiers";
import { goalContractAbi } from "contracts/abi/goalContract";
import { ethers } from "ethers";
import { Form, Formik } from "formik";
import useDebounce from "hooks/useDebounce";
import useToasts from "hooks/useToast";
import { useState } from "react";
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
import GoalStakeSharingTooltip from "./GoalStakeSharingTooltip";

/**
 * A component with form to set a goal.
 */
export default function GoalSetForm(props: {
  onSuccessSet: (id: string) => void;
}) {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { showToastError } = useToasts();

  const goalExamples = [
    "⌨️ Code every day for 14 days…",
    "✈️ Go to Spain with family...",
    "✨ Reach 1,000 followers on…",
    "🎸 Go to the festival…",
    "🏆 Win the championship…",
    "🏔️ Conquer the peak of…",
    "👟 Run a half marathon…",
    "👨‍💼 Find a job as…",
    "💪 Go to the gym every week for 3 months…",
    "💰 Save $10,000 for…",
    "📖 Read 12 books…",
    "🔁 Publish posts every day on…",
    "🚀 Release a product…",
    "🧑‍🎓 Complete a course…",
    "🧘 Meditate for 30 days…",
  ];

  // Form states
  const [formValues, setFormValues] = useState({
    description: "",
    stake: 0.01,
    stakeCurrency: "native",
    deadline: "2023-06-01",
    verificationRequirement: VERIFICATION_REQUIREMENTS.anyProofUri,
  });
  const formValidationSchema = yup.object({
    description: yup.string().required(),
    stake: yup.number().required(),
    stakeCurrency: yup.string().required(),
    deadline: yup.string().required(),
    verificationRequirement: yup.string().required(),
  });
  const debouncedFormValues = useDebounce(formValues);

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "set",
      args: [
        debouncedFormValues.description,
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

  const isFormLoading = isContractWriteLoading || isTransactionLoading;
  const isFormDisabled = isFormLoading || isTransactionSuccess;
  const isFormSubmitButtonDisabled =
    isFormDisabled || isContractPrepareError || !contractWrite;

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

  return (
    <CentralizedBox>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        🤝 Dear Web3,
      </Typography>
      <Formik
        initialValues={formValues}
        validationSchema={formValidationSchema}
        onSubmit={() => contractWrite?.()}
      >
        {({ values, errors, touched, handleChange, setValues }) => (
          <Form style={{ width: "100%" }}>
            <FormikHelper onChange={(values: any) => setFormValues(values)} />
            {/* Description input */}
            <WidgetBox bgcolor={palette.blue} mb={3}>
              <WidgetTitle>My goal is</WidgetTitle>
              <Autocomplete
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
            <WidgetSeparatorText mb={4}>
              otherwise the stake will be{" "}
              <GoalStakeSharingTooltip>
                <Typography
                  component="span"
                  color="primary.main"
                  fontWeight={700}
                  sx={{ cursor: "help" }}
                >
                  shared
                </Typography>
              </GoalStakeSharingTooltip>{" "}
              between motivators and application
            </WidgetSeparatorText>
            {/* Submit button */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
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
            <WidgetSeparatorText color={grey[600]}>
              you need to have a{" "}
              <MuiLink href={`/accounts/${address}`}>profile</MuiLink> to set a
              goal
            </WidgetSeparatorText>
          </Form>
        )}
      </Formik>
    </CentralizedBox>
  );
}
