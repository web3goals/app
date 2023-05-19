import { Box, Link as MuiLink, TextField, Typography } from "@mui/material";
import FormikHelper from "components/helper/FormikHelper";
import Layout from "components/layout";
import { ExtraLargeLoadingButton, ThickDivider } from "components/styled";
import { CONTACTS } from "constants/contacts";
import { FORMS } from "constants/forms";
import { Form, Formik } from "formik";
import useError from "hooks/useError";
import useFormSubmit from "hooks/useFormSubmit";
import useToasts from "hooks/useToast";
import Image from "next/image";
import { useState } from "react";
import { Analytics } from "utils/analytics";
import { useAccount } from "wagmi";
import * as yup from "yup";

/**
 * Club page.
 */
export default function Club() {
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
    name: yup.string().required(),
    contact: yup.string().required(),
    message: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const isFormDisabled = isFormSubmitting;

  async function submit(values: any, actions: any) {
    try {
      setIsFormSubmitting(true);
      await submitForm(FORMS.type.joining, values, address);
      showToastSuccess("Thanks! We'll get back soon");
      Analytics.postedFeedback();
      actions?.resetForm();
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  return (
    <Layout maxWidth="sm">
      <Typography variant="h4" fontWeight={700} textAlign="center">
        Meet the early adopters club!
      </Typography>
      <Box mt={2}>
        <Image
          src="/images/astronaut.gif"
          alt="Astronaut"
          width="100"
          height="100"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "10px",
          }}
        />
      </Box>
      <Typography textAlign="center" mt={2}>
        It's a community of achievers and motivators who want to create a bright
        future for themselves and everyone around them ✨
      </Typography>
      <Typography textAlign="center" mt={2}>
        We are the first users of this project! We are the early adopters 🧑‍🚀
      </Typography>
      <Typography textAlign="center" mt={2}>
        We are the people who fill this space with a starting energy that will
        be enough to energize everyone around us ⚡
      </Typography>
      <Typography textAlign="center" mt={2}>
        That is why goal setting and other features are only available to club
        members
      </Typography>
      <ThickDivider sx={{ mt: 6, mb: 6 }} />
      <Typography fontWeight={700} textAlign="center">
        If you are eager to join us, please fill out the following form 🚀
      </Typography>
      <Typography textAlign="center" mt={1}>
        We will be glad to see everyone with sparkling eyes!
      </Typography>
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
                label="Your name or pseudonym *"
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
                placeholder="I'm not superman, but..."
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
              <ExtraLargeLoadingButton
                loading={isFormSubmitting}
                variant="contained"
                type="submit"
                disabled={isFormDisabled}
              >
                Submit
              </ExtraLargeLoadingButton>
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
    </Layout>
  );
}
