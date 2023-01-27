import GoalSetForm from "components/goal/GoalSetForm";
import GoalSetMessage from "components/goal/GoalSetMessage";
import Layout from "components/layout";
import { useState } from "react";

/**
 * Page to set a goal.
 */
export default function SetGoal() {
  const [setGoalId, setSetGoalId] = useState<string | undefined>();

  return (
    <Layout maxWidth="sm">
      {setGoalId ? (
        <GoalSetMessage id={setGoalId} />
      ) : (
        <GoalSetForm
          onSuccessSet={(createdGoalId) => setSetGoalId(createdGoalId)}
        />
      )}
    </Layout>
  );
}
