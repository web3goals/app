import AccountExplore from "components/account/AccountExplore";
import GoalExplore from "components/goal/GoalExplore";
import GoalMessageExplore from "components/goal/GoalMessageExplore";
import Layout from "components/layout";
import { ThickDivider } from "components/styled";
import TreasuryExplore from "components/treasury/TreasuryExplore";

/**
 * Explore page.
 */
export default function Explore() {
  return (
    <Layout>
      <GoalExplore pageSize={3} displayExploreAllButton />
      <ThickDivider sx={{ mt: 8, mb: 8 }} />
      <TreasuryExplore />
      <ThickDivider sx={{ mt: 8, mb: 8 }} />
      <AccountExplore pageSize={3} displayExploreAllButton />
      <ThickDivider sx={{ mt: 8, mb: 8 }} />
      <GoalMessageExplore pageSize={3} displayExploreAllButton />
    </Layout>
  );
}
