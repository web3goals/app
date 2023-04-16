import GoalExplore from "components/goal/GoalExplore";
import Layout from "components/layout";

/**
 * Page with goals.
 */
export default function Goals() {
  return (
    <Layout>
      <GoalExplore displayLoadMoreButton />
    </Layout>
  );
}
