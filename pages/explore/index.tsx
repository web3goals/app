import AccountExplore from "components/account/AccountExplore";
import GoalExplore from "components/goal/GoalExplore";
import GoalStepExplore from "components/goal/GoalStepExplore";
import Layout from "components/layout";
import { ThickDivider } from "components/styled";

/**
 * Explore page.
 */
export default function Explore() {
  return (
    <Layout>
      <GoalExplore pageSize={3} displayExploreAllButton />
      <ThickDivider sx={{ mt: 8, mb: 8 }} />
      <AccountExplore pageSize={3} displayExploreAllButton />
      <ThickDivider sx={{ mt: 8, mb: 8 }} />
      <GoalStepExplore pageSize={3} displayExploreAllButton />
    </Layout>
  );
}
