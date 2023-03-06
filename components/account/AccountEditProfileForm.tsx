import { Person } from "@mui/icons-material";
import { Avatar, TextField } from "@mui/material";
import { Box } from "@mui/system";
import FormikHelper from "components/helper/FormikHelper";
import { XxlLoadingButton } from "components/styled";
import { profileContractAbi } from "contracts/abi/profileContract";
import ProfileUriDataEntity from "entities/ProfileUriDataEntity";
import { Form, Formik } from "formik";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import useToasts from "hooks/useToast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { getProfileContractAddress, getChainId } from "utils/chains";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import * as yup from "yup";

/**
 * A component with form to edit account profile.
 */
export default function AccountEditProfileForm(props: {
  profileData: ProfileUriDataEntity | null;
}) {
  const { handleError } = useError();
  const { uploadJsonToIpfs, uploadFileToIpfs, ipfsUriToHttpUri } = useIpfs();
  const { showToastSuccess } = useToasts();
  const router = useRouter();
  const { chain } = useNetwork();
  const { address } = useAccount();

  // Form states
  const [formImageValue, setFormImageValue] = useState<{
    file: any;
    uri: any;
  }>();
  const [formValues, setFormValues] = useState({
    name: props.profileData?.attributes?.[0]?.value || "",
    about: props.profileData?.attributes?.[1]?.value || "",
    email: props.profileData?.attributes?.[2]?.value || "",
    website: props.profileData?.attributes?.[3]?.value || "",
    twitter: props.profileData?.attributes?.[4]?.value || "",
    telegram: props.profileData?.attributes?.[5]?.value || "",
    instagram: props.profileData?.attributes?.[6]?.value || "",
  });
  const formValidationSchema = yup.object({
    name: yup.string(),
    about: yup.string(),
    email: yup.string(),
    website: yup.string(),
    twitter: yup.string(),
    telegram: yup.string(),
    instagram: yup.string(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const [updatedProfileDataUri, setUpdatedProfileDataUri] = useState("");

  // Contract states
  const { config: contractConfig } = usePrepareContractWrite({
    address: getProfileContractAddress(chain),
    abi: profileContractAbi,
    functionName: "setURI",
    args: [updatedProfileDataUri],
    chainId: getChainId(chain),
  });
  const {
    data: contractWriteData,
    isLoading: isContractWriteLoading,
    write: contractWrite,
  } = useContractWrite(contractConfig);
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransaction({
      hash: contractWriteData?.hash,
    });

  const isFormDisabled =
    isFormSubmitting ||
    isContractWriteLoading ||
    isTransactionLoading ||
    isTransactionSuccess;

  async function onImageChange(files: Array<any>) {
    try {
      // Get file
      const file = files?.[0];
      if (!file) {
        return;
      }
      // Check file size
      const isLessThan2Mb = file.size / 1024 / 1024 < 2;
      if (!isLessThan2Mb) {
        throw new Error(
          "Only files with size smaller than 2MB are currently supported!"
        );
      }
      // Read and save file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          // Save states
          setFormImageValue({
            file: file,
            uri: fileReader.result,
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
      // Upload image to ipfs
      let imageIpfsUri;
      if (formImageValue?.file) {
        const { uri } = await uploadFileToIpfs(formImageValue.file);
        imageIpfsUri = uri;
      }
      const profileUriData: ProfileUriDataEntity = {
        name: "Web3 Goals Profile",
        image: imageIpfsUri || props.profileData?.image || "",
        attributes: [
          { trait_type: "name", value: values.name },
          { trait_type: "about", value: values.about },
          { trait_type: "email", value: values.email },
          { trait_type: "website", value: values.website },
          { trait_type: "twitter", value: values.twitter },
          { trait_type: "telegram", value: values.telegram },
          { trait_type: "instagram", value: values.instagram },
        ],
      };
      // Upload updated profile data to ipfs
      const { uri } = await uploadJsonToIpfs(profileUriData);
      setUpdatedProfileDataUri(uri);
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  useEffect(() => {
    // Write data to contract if form was submitted
    if (
      updatedProfileDataUri !== "" &&
      contractWrite &&
      !isContractWriteLoading
    ) {
      setUpdatedProfileDataUri("");
      contractWrite?.();
      setIsFormSubmitting(false);
    }
  }, [updatedProfileDataUri, contractWrite, isContractWriteLoading]);

  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Changes saved, account will be updated soon");
      router.push(`/accounts/${address}`);
    }
  }, [isTransactionSuccess]);

  return (
    <Formik
      initialValues={formValues}
      validationSchema={formValidationSchema}
      onSubmit={submit}
    >
      {({ values, errors, touched, handleChange }) => (
        <Form style={{ width: "100%" }}>
          <FormikHelper onChange={(values: any) => setFormValues(values)} />
          {/* Image */}
          <Dropzone
            multiple={false}
            disabled={isFormDisabled}
            onDrop={(files) => onImageChange(files)}
            accept={{ "image/*": [] }}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar
                    sx={{
                      cursor: !isFormDisabled ? "pointer" : undefined,
                      width: 164,
                      height: 164,
                      borderRadius: 164,
                    }}
                    src={
                      formImageValue?.uri ||
                      (props.profileData?.image
                        ? ipfsUriToHttpUri(props.profileData.image)
                        : undefined)
                    }
                  >
                    <Person sx={{ fontSize: 64 }} />
                  </Avatar>
                </Box>
              </div>
            )}
          </Dropzone>
          {/* Name */}
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            placeholder="Alice"
            value={values.name}
            onChange={handleChange}
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
            disabled={isFormDisabled}
            sx={{ mt: 4 }}
          />
          {/* About */}
          <TextField
            fullWidth
            id="about"
            name="about"
            label="About"
            placeholder="crypto enthusiast..."
            multiline={true}
            rows={3}
            value={values.about}
            onChange={handleChange}
            error={touched.about && Boolean(errors.about)}
            helperText={touched.about && errors.about}
            disabled={isFormDisabled}
            sx={{ mt: 2 }}
          />
          {/* Email */}
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            placeholder="alice@web3goals.space"
            value={values.email}
            onChange={handleChange}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
            disabled={isFormDisabled}
            sx={{ mt: 2 }}
          />
          {/* Website */}
          <TextField
            fullWidth
            id="website"
            name="website"
            label="Website"
            placeholder="https://web3goals.space"
            value={values.website}
            onChange={handleChange}
            error={touched.website && Boolean(errors.website)}
            helperText={touched.website && errors.website}
            disabled={isFormDisabled}
            sx={{ mt: 2 }}
          />
          {/* Twitter */}
          <TextField
            fullWidth
            id="twitter"
            name="twitter"
            label="Twitter"
            placeholder="alice"
            value={values.twitter}
            onChange={handleChange}
            error={touched.twitter && Boolean(errors.twitter)}
            helperText={touched.twitter && errors.twitter}
            disabled={isFormDisabled}
            sx={{ mt: 2 }}
          />
          {/* Telegram */}
          <TextField
            fullWidth
            id="telegram"
            name="telegram"
            label="Telegram"
            placeholder="alice"
            value={values.telegram}
            onChange={handleChange}
            error={touched.telegram && Boolean(errors.telegram)}
            helperText={touched.telegram && errors.telegram}
            disabled={isFormDisabled}
            sx={{ mt: 2 }}
          />
          {/* Instagram */}
          <TextField
            fullWidth
            id="instagram"
            name="instagram"
            label="Instagram"
            placeholder="alice"
            value={values.instagram}
            onChange={handleChange}
            error={touched.instagram && Boolean(errors.instagram)}
            helperText={touched.instagram && errors.instagram}
            disabled={isFormDisabled}
            sx={{ mt: 2 }}
          />
          {/* Submit button */}
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <XxlLoadingButton
              loading={
                isFormSubmitting ||
                isContractWriteLoading ||
                isTransactionLoading
              }
              variant="contained"
              type="submit"
              disabled={isFormDisabled || !contractWrite}
            >
              Save
            </XxlLoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
