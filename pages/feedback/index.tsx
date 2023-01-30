import { Box, Link as MuiLink, TextField, Typography } from "@mui/material";
import FormikHelper from "components/helper/FormikHelper";
import Layout from "components/layout";
import { CentralizedBox, XxlLoadingButton } from "components/styled";
import { contact } from "constants/contact";
import { form } from "constants/form";
import { Form, Formik } from "formik";
import useError from "hooks/useError";
import useFormSubmit from "hooks/useFormSubmit";
import useToasts from "hooks/useToast";
import { useState } from "react";
import { useAccount } from "wagmi";
import * as yup from "yup";

/**
 * Feedback page.
 */
export default function Feedback() {
  const { address } = useAccount();
  const { handleError } = useError();
  const { submitForm } = useFormSubmit();
  const { showToastSuccess } = useToasts();

  // Form states
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: "",
  });
  const formValidationSchema = yup.object({
    name: yup.string(),
    email: yup.string().required(),
    message: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const isFormDisabled = isFormSubmitting;

  async function submit(values: any, actions: any) {
    try {
      setIsFormSubmitting(true);
      await submitForm(form.type.feedback, values, address);
      showToastSuccess("Thanks for the feedback! We'll get back soon");
      actions?.resetForm();
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  return (
    <Layout maxWidth="xs">
      <CentralizedBox>
        {/* Title */}
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: 1.5 }}
        >
          ✍️ Feedback
        </Typography>
        {/* Description */}
        <Typography textAlign="center" sx={{ mb: 2 }}>
          Do you have a question or suggestion?
        </Typography>
        {/* Form */}
        <Formik
          initialValues={formValues}
          validationSchema={formValidationSchema}
          onSubmit={submit}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form style={{ width: "100%" }}>
              <FormikHelper onChange={(values: any) => setFormValues(values)} />
              {/* Name */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Your name or pseudonym (optional)"
                  placeholder="Alice"
                  type="string"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  disabled={isFormDisabled}
                />
              </Box>
              {/* Email */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Your email *"
                  placeholder="alice@web3goals.space"
                  type="string"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  disabled={isFormDisabled}
                />
              </Box>
              {/* Message */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  id="message"
                  name="message"
                  label="Your message *"
                  placeholder="I think that..."
                  type="string"
                  multiline={true}
                  rows={3}
                  value={values.message}
                  onChange={handleChange}
                  error={touched.message && Boolean(errors.message)}
                  helperText={touched.message && errors.message}
                  disabled={isFormDisabled}
                />
              </Box>
              {/* Submit button */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <XxlLoadingButton
                  loading={isFormSubmitting}
                  variant="contained"
                  type="submit"
                  disabled={isFormDisabled}
                >
                  Send
                </XxlLoadingButton>
              </Box>
            </Form>
          )}
        </Formik>
        {/* Message with email */}
        <Typography textAlign="center" sx={{ mt: 6, mb: 2 }}>
          📩 Or write to us
        </Typography>
        <MuiLink
          href={`mailto:${contact.email}`}
          target="_blank"
          fontWeight={700}
        >
          {contact.email}
        </MuiLink>
      </CentralizedBox>
    </Layout>
  );
}
