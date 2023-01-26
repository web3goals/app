import { Typography } from "@mui/material";
import Layout from "components/layout";
import { CentralizedBox } from "components/styled";

/**
 * Page with goals.
 */
export default function Goals() {
  return (
    <Layout>
      <CentralizedBox>
        {/* Last goals */}
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: 4 }}
        >
          🎯 Last goals
        </Typography>
        <Typography textAlign="center">...</Typography>
      </CentralizedBox>
    </Layout>
  );
}
