import AccountExplore from "components/account/AccountExplore";
import GoalExplore from "components/goal/GoalExplore";
import Layout from "components/layout";
import { ThickDivider } from "components/styled";

/**
 * Explore page.
 */
export default function Explore() {
  return (
    <Layout>
      <GoalExplore />
      <ThickDivider sx={{ mt: 8, mb: 8 }} />
      <AccountExplore />
    </Layout>
  );
}
