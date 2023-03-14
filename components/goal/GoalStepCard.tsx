import GoalStepEntity from "entities/subgraph/GoalStepEntity";
import { SxProps } from "@mui/material";
import { CardBox } from "components/styled";

/**
 * A component with a goal step card.
 *
 * TODO: Implement component
 */
export default function GoalStepCard(props: {
  goalStep: GoalStepEntity;
  sx?: SxProps;
}) {
  return (
    <CardBox sx={{ ...props.sx }}>
      <pre>{JSON.stringify(props.goalStep, null, 2)}</pre>
    </CardBox>
  );
}
