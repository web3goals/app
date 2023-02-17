import { Autocomplete, Box, MenuItem, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import FormikHelper from "components/helper/FormikHelper";
import {
  CentralizedBox,
  WidgetInputSelect,
  WidgetInputTextField,
  XxlLoadingButton,
} from "components/styled";
import WidgetBox from "components/widget/WidgetBox";
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
    verificationGitHubUsername: "",
    verificationGitHubActivityDays: "",
  });
  const formValidationSchema = yup.object({
    description: yup.string().required(),
    stake: yup.number().required(),
    stakeCurrency: yup.string().required(),
    deadline: yup.string().required(),
    verificationRequirement: yup.string().required(),
    verificationGitHubUsername:
      formValues.verificationRequirement ===
      VERIFICATION_REQUIREMENTS.gitHubActivity
        ? yup.string().required()
        : yup.string(),
    verificationGitHubActivityDays:
      formValues.verificationRequirement ===
      VERIFICATION_REQUIREMENTS.gitHubActivity
        ? yup.string().required()
        : yup.string(),
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
        [
          ...(debouncedFormValues.verificationGitHubUsername &&
          debouncedFormValues.verificationGitHubActivityDays
            ? [
                VERIFICATION_DATA_KEYS.gitHubUsername,
                VERIFICATION_DATA_KEYS.gitHubActivityDays,
              ]
            : []),
        ],
        [
          ...(debouncedFormValues.verificationGitHubUsername &&
          debouncedFormValues.verificationGitHubActivityDays
            ? [
                debouncedFormValues.verificationGitHubUsername,
                debouncedFormValues.verificationGitHubActivityDays,
              ]
            : []),
        ],
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

  function getVerificationRequirements(description: string): string {
    if (description === "Complete the challenge #14DaysOfCode") {
      return VERIFICATION_REQUIREMENTS.gitHubActivity;
    }
    return VERIFICATION_REQUIREMENTS.anyProof;
  }

  function getVerificationGitHubActivityDays(description: string): string {
    if (description === "Complete the challenge #14DaysOfCode") {
      return "14";
    }
    return "";
  }

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
            <WidgetBox title="My goal is" color={palette.blue} sx={{ mb: 2 }}>
              <Autocomplete
                onChange={(_, value: string) => {
                  setValues({
                    description: value,
                    stake: values.stake,
                    stakeCurrency: values.stakeCurrency,
                    deadline: values.deadline,
                    verificationRequirement: getVerificationRequirements(value),
                    verificationGitHubUsername: "",
                    verificationGitHubActivityDays:
                      getVerificationGitHubActivityDays(value),
                  });
                }}
                inputValue={values.description}
                onInputChange={(_, value) => {
                  setValues({
                    description: value,
                    stake: values.stake,
                    stakeCurrency: values.stakeCurrency,
                    deadline: values.deadline,
                    verificationRequirement: getVerificationRequirements(value),
                    verificationGitHubUsername: "",
                    verificationGitHubActivityDays:
                      getVerificationGitHubActivityDays(value),
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
            {/* GitHub username input */}
            {values.verificationRequirement ===
              VERIFICATION_REQUIREMENTS.gitHubActivity && (
              <>
                <Typography fontWeight={700} textAlign="center" sx={{ mb: 3 }}>
                  which can be checked with my activity on
                </Typography>
                <WidgetBox
                  title="GitHub"
                  color={palette.purpleLight}
                  sx={{ mb: 3 }}
                >
                  <WidgetInputTextField
                    id="verificationGitHubUsername"
                    name="verificationGitHubUsername"
                    placeholder="username"
                    value={values.verificationGitHubUsername}
                    onChange={handleChange}
                    error={
                      touched.verificationGitHubUsername &&
                      Boolean(errors.verificationGitHubUsername)
                    }
                    helperText={
                      touched.verificationGitHubUsername &&
                      errors.verificationGitHubUsername
                    }
                    disabled={isFormDisabled}
                    sx={{ width: 1 }}
                  />
                </WidgetBox>
              </>
            )}
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
                    {getChainNativeCurrencySymbol(chain)}
                  </MenuItem>
                </WidgetInputSelect>
              </Stack>
            </WidgetBox>
            {/* Text divider */}
            <Typography fontWeight={700} textAlign="center" sx={{ mb: 3 }}>
              on achieving it
            </Typography>
            {/* Deadline input */}
            <WidgetBox title="By" color={palette.purpleDark} sx={{ mb: 3 }}>
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
