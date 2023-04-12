import { Box, SxProps, Typography } from "@mui/material";
import { CenterBoldText } from "components/styled";
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
      {/* Title */}
      <Typography variant="h4" fontWeight={700} textAlign="center">
        ⚡️ Steps to achieving the goal
      </Typography>
      <CenterBoldText mt={2}>
        updates, discussions, proofs and result
      </CenterBoldText>
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
      <GoalStepList
        id={props.id}
        authorAddress={props.authorAddress}
        isClosed={props.isClosed}
        sx={{ mt: 4 }}
      />
    </Box>
  );
}
