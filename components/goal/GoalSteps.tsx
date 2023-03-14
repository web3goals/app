import { Box, SxProps, Typography } from "@mui/material";
import { WidgetSeparatorText } from "components/styled";
import GoalStepList from "./GoalStepList";

/**
 * A component with goal steps,
 */
export default function GoalSteps(props: { id: string; sx?: SxProps }) {
  return (
    <Box
      sx={{
        width: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...props.sx,
      }}
    >
      {/* Title */}
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🏔️ Way to achieve the goal
      </Typography>
      <WidgetSeparatorText mt={2}>
        steps, facts, emotions and result
      </WidgetSeparatorText>
      {/* Actions */}
      {/* TODO: Add button with actions */}
      {/* List */}
      <GoalStepList id={props.id} sx={{ mt: 4 }} />
    </Box>
  );
}
