import GoalStepExplore from "components/goal/GoalStepExplore";
import Layout from "components/layout";

/**
 * Page with goal steps.
 */
export default function GoalSteps() {
  return (
    <Layout>
      <GoalStepExplore displayLoadMoreButton />
    </Layout>
  );
}
