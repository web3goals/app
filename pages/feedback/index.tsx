import { Link as MuiLink, Typography } from "@mui/material";
import Layout from "components/layout";
import { CentralizedBox } from "components/styled";
import { contact } from "constants/contact";

/**
 * Feedback page.
 */
export default function Feedback() {
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
        {/* Message with email */}
        <Typography textAlign="center" sx={{ mb: 2 }}>
          Write to us at{" "}
          <MuiLink
            href={`mailto:${contact.email}`}
            target="_blank"
            fontWeight={700}
          >
            {contact.email}
          </MuiLink>
        </Typography>
      </CentralizedBox>
    </Layout>
  );
}
