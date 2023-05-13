import { useCreateAsset } from "@livepeer/react";
import { Box, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import FormikHelper from "components/helper/FormikHelper";
import {
  ExtraLargeLoadingButton,
  WidgetBox,
  WidgetInputTextField,
  WidgetTitle,
} from "components/styled";
import TextAttachmentUriDataEntity from "entities/uri/TextAttachmentUriDataEntity";
import { Form, Formik } from "formik";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { palette } from "theme/palette";
import * as yup from "yup";

/**
 * A form to submit text and attachment.
 */
export default function TextAttachmentForm(props: {
  isLoading: boolean;
  isDisabled: boolean;
  isSubmittingDisabled: boolean;
  isAttachmentRequired: boolean;
  onSubmit: (submittedFormDataUri: string) => void;
  textColor?: string;
  textPlaceholder?: string;
  attachmentColor?: string;
  sx?: SxProps;
}) {
  const { handleError } = useError();
  const { uploadFileToIpfs, uploadJsonToIpfs } = useIpfs();

  /**
   * Form states
   */
  const [formAttachmentValue, setFormAttachmentValue] = useState<
    | {
        file: File;
        uri: string;
        isImage: boolean;
        isVideo: boolean;
      }
    | undefined
  >();
  const [formValues, setFormValues] = useState({
    text: "",
  });
  const formValidationSchema = yup.object({
    text: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  /**
   * Livepeer states
   */
  const {
    mutate: createLivepeerAsset,
    data: livepeerAsset,
    status: livepeerStatus,
    progress: livepeerProgress,
    error: livepeerError,
  } = useCreateAsset(
    formAttachmentValue?.file
      ? {
          sources: [
            {
              name: formAttachmentValue.file.name,
              file: formAttachmentValue.file,
            },
          ] as const,
        }
      : null
  );

  /**
   * Save file to state if attachment is changed
   */
  async function onAttachmentChange(files: any[]) {
    try {
      const file = files?.[0];
      if (!file) {
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2 && fileReader.result) {
          setFormAttachmentValue({
            file: file,
            uri: fileReader.result.toString(),
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

  /**
   * Start process form
   */
  async function submitForm() {
    try {
      setIsFormSubmitting(true);
      // Upload attachment to livepeer
      if (formAttachmentValue && formAttachmentValue.isVideo) {
        createLivepeerAsset?.();
      }
      // Upload attachment to ipfs and upload data to ipfs
      else if (formAttachmentValue) {
        const { uri } = await uploadFileToIpfs(formAttachmentValue.file);
        uploadFormDataToIpfs({
          text: formValues.text,
          attachment: {
            type: formAttachmentValue.isImage
              ? "IMAGE"
              : formAttachmentValue.isVideo
              ? "VIDEO"
              : "FILE",
            addedData: new Date().getTime(),
            uri: uri,
          },
        });
      }
      // Upload form data to ipfs without attachment if it not required
      else if (!props.isAttachmentRequired) {
        uploadFormDataToIpfs({ text: formValues.text });
      }
      // Display error if attachment is required
      else {
        throw new Error("Attachment is required");
      }
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  /**
   * Upload form data to ipfs
   */
  async function uploadFormDataToIpfs(formData: TextAttachmentUriDataEntity) {
    try {
      const { uri } = await uploadJsonToIpfs(formData);
      props.onSubmit(uri);
      setIsFormSubmitting(false);
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  /**
   * Upload form data to ipfs if attachment uploaded to livepeer
   */
  useEffect(() => {
    if (formAttachmentValue && livepeerAsset) {
      uploadFormDataToIpfs({
        text: formValues.text,
        attachment: {
          type: "LIVEPEER_VIDEO",
          addedData: new Date().getTime(),
          livepeerPlaybackId: livepeerAsset[0].playbackId,
        },
      });
    }
  }, [formAttachmentValue, livepeerAsset]);

  /**
   * Form states
   */
  const isFormLoading = isFormSubmitting || props.isLoading;
  const isFormDisabled = isFormSubmitting || props.isDisabled;
  const isFormSubmittingDisabled = isFormDisabled || props.isSubmittingDisabled;

  return (
    <Box sx={{ width: 1, mt: 4, ...props.sx }}>
      <Formik
        initialValues={formValues}
        validationSchema={formValidationSchema}
        onSubmit={submitForm}
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
            <WidgetBox bgcolor={props.textColor || palette.blue}>
              <WidgetTitle>Text</WidgetTitle>
              <WidgetInputTextField
                id="text"
                name="text"
                placeholder={props.textPlaceholder || "..."}
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
            <WidgetBox
              bgcolor={props.attachmentColor || palette.purpleDark}
              mt={2}
              sx={{ width: 1 }}
            >
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
              loading={isFormLoading}
              variant="outlined"
              type="submit"
              disabled={isFormSubmittingDisabled}
              sx={{ mt: 2 }}
            >
              Submit
            </ExtraLargeLoadingButton>
            {/* Livepeer progress */}
            {(livepeerProgress?.[0].phase === "uploading" ||
              livepeerProgress?.[0].phase === "processing") && (
              <Typography textAlign="center" color="text.secondary" mt={2}>
                {livepeerProgress?.[0].phase === "uploading"
                  ? "Uploading: "
                  : "Processing: "}
                {Math.round(livepeerProgress?.[0]?.progress * 100)}%
              </Typography>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
}
