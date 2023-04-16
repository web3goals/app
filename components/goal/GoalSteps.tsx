import { Box, SxProps, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import GoalActions from "./GoalActions";
import GoalStepList from "./GoalStepList";

/**
 * A component with goal steps,
 */
export default function GoalSteps(props: {
  id: string;
  authorAddress: string;
  deadlineTimestamp: BigNumber;
  verificationRequirement: string;
  isClosed: boolean;
  onUpdate: Function;
  sx?: SxProps;
}) {
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
      {/* Title and subtitle*/}
      <Typography variant="h4" fontWeight={700} textAlign="center">
        ⚡️ Steps to achieving the goal
      </Typography>
      <Typography textAlign="center" mt={1}>
        updates, discussions, proofs and result
      </Typography>
      {/* Actions */}
      <GoalActions
        id={props.id}
        authorAddress={props.authorAddress}
        deadlineTimestamp={props.deadlineTimestamp}
        isClosed={props.isClosed}
        verificationRequirement={props.verificationRequirement}
        onSuccess={props.onUpdate}
        sx={{ mt: 4 }}
      />
      {/* List */}
      <GoalStepList id={props.id} sx={{ mt: 4 }} />
    </Box>
  );
}
