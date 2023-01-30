import { Typography } from "@mui/material";
import GoalList from "components/goal/GoalList";
import Layout from "components/layout";
import { CentralizedBox } from "components/styled";

/**
 * Page with goals.
 */
export default function Goals() {
  return (
    <Layout>
      <CentralizedBox>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: 4 }}
        >
          🎯 Last goals
        </Typography>
        <GoalList />
      </CentralizedBox>
    </Layout>
  );
}
