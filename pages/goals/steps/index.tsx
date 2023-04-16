import { Typography } from "@mui/material";
import GoalStepList from "components/goal/GoalStepList";
import Layout from "components/layout";

/**
 * Page with goal steps.
 */
export default function GoalSteps() {
  return (
    <Layout>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        ✨️ Steps
      </Typography>
      <Typography color="text.secondary" textAlign="center" mt={1}>
        leading to achievement and success
      </Typography>
      <GoalStepList displayGoalLink sx={{ mt: 4 }} />
    </Layout>
  );
}
