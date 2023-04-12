import { Typography } from "@mui/material";
import GoalList from "components/goal/GoalList";
import Layout from "components/layout";
import { CenterBox } from "components/styled";

/**
 * Page with goals.
 */
export default function Goals() {
  return (
    <Layout>
      <CenterBox>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          ✨ Goals
        </Typography>
        <Typography color="text.secondary" textAlign="center" mt={1}>
          that inspire us and everyone around us.
        </Typography>
        <GoalList sx={{ mt: 4 }} />
      </CenterBox>
    </Layout>
  );
}
