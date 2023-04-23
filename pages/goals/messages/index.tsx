import GoalMessageExplore from "components/goal/GoalMessageExplore";
import Layout from "components/layout";

/**
 * Page with goal messages.
 */
export default function GoalMessages() {
  return (
    <Layout>
      <GoalMessageExplore displayLoadMoreButton />
    </Layout>
  );
}
