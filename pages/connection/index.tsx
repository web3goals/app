import { Box, Link as MuiLink, TextField, Typography } from "@mui/material";
import FormikHelper from "components/helper/FormikHelper";
import Layout from "components/layout";
import { ExtraLargeLoadingButton } from "components/styled";
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
 * Connection page.
 */
export default function Connection() {
  const { address } = useAccount();
  const { handleError } = useError();
  const { submitForm } = useFormSubmit();
  const { showToastSuccess } = useToasts();

  // Form states
  const [formValues, setFormValues] = useState({
    name: "",
    contact: "",
  });
  const formValidationSchema = yup.object({
    name: yup.string(),
    contact: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const isFormDisabled = isFormSubmitting;

  async function submit(values: any, actions: any) {
    try {
      setIsFormSubmitting(true);
      await submitForm(FORMS.type.connection, values, address);
      showToastSuccess("Thanks for connection!");
      Analytics.postedContacts();
      actions?.resetForm();
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  return (
    <Layout maxWidth="xs">
      {/* Title */}
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🤝️ Connection
      </Typography>
      {/* Description */}
      <Typography textAlign="center" mt={2}>
        Leave your contacts so we don't lose each other in this big world
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
            {/* Submit button */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={2}
            >
              <ExtraLargeLoadingButton
                loading={isFormSubmitting}
                variant="contained"
                type="submit"
                disabled={isFormDisabled}
              >
                Send
              </ExtraLargeLoadingButton>
            </Box>
          </Form>
        )}
      </Formik>
      {/* Message with twitter */}
      <Typography textAlign="center" sx={{ mt: 4 }}>
        Or follow us on{" "}
        <MuiLink href={CONTACTS.twitter} target="_blank">
          Twitter
        </MuiLink>
      </Typography>
    </Layout>
  );
}
