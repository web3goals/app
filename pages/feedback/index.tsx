import { Box, Link as MuiLink, TextField, Typography } from "@mui/material";
import FormikHelper from "components/helper/FormikHelper";
import Layout from "components/layout";
import { CentralizedBox, XxlLoadingButton } from "components/styled";
import { CONTACTS } from "constants/contacts";
import { FORMS } from "constants/forms";
import { Form, Formik } from "formik";
import useError from "hooks/useError";
import useFormSubmit from "hooks/useFormSubmit";
import useToasts from "hooks/useToast";
import { useState } from "react";
import { Analytics } from "utils/analytics";
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
    contact: "",
    message: "",
  });
  const formValidationSchema = yup.object({
    name: yup.string(),
    contact: yup.string().required(),
    message: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const isFormDisabled = isFormSubmitting;

  async function submit(values: any, actions: any) {
    try {
      setIsFormSubmitting(true);
      await submitForm(FORMS.type.feedback, values, address);
      showToastSuccess("Thanks for feedback! We'll get back soon");
      Analytics.postedFeedback();
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
        <Typography textAlign="center">
          Do you have a question or suggestion? Fill the form
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
              <Box mt={4}>
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
              {/* Contact */}
              <Box mt={2}>
                <TextField
                  fullWidth
                  id="contact"
                  name="contact"
                  label="Your email, twitter, lens, telegram *"
                  placeholder="alice@web3goals.space"
                  type="string"
                  value={values.contact}
                  onChange={handleChange}
                  error={touched.contact && Boolean(errors.contact)}
                  helperText={touched.contact && errors.contact}
                  disabled={isFormDisabled}
                />
              </Box>
              {/* Message */}
              <Box mt={2}>
                <TextField
                  fullWidth
                  id="message"
                  name="message"
                  label="Your message *"
                  placeholder="I think that…"
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
                display="flex"
                flexDirection="column"
                alignItems="center"
                mt={2}
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
        <Typography textAlign="center" mt={6}>
          You can also email us at{" "}
          <MuiLink href={`mailto:${CONTACTS.email}`} target="_blank">
            {CONTACTS.email}
          </MuiLink>{" "}
          or send message on{" "}
          <MuiLink href={CONTACTS.twitter} target="_blank">
            Twitter
          </MuiLink>
        </Typography>
      </CentralizedBox>
    </Layout>
  );
}
