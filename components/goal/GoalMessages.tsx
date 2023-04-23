import { Box, SxProps, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import GoalActions from "./GoalActions";
import GoalMessageList from "./GoalMessageList";

/**
 * A component with goal messages,
 */
export default function GoalMessages(props: {
  id: string;
  authorAddress: string;
  deadlineTimestamp: BigNumber;
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
        ✨ Goal messages
      </Typography>
      <Typography color="text.secondary" textAlign="center" mt={1}>
        from beginning to end of the journey
      </Typography>
      {/* Actions */}
      <GoalActions
        id={props.id}
        authorAddress={props.authorAddress}
        deadlineTimestamp={props.deadlineTimestamp}
        isClosed={props.isClosed}
        onSuccess={props.onUpdate}
        sx={{ mt: 4 }}
      />
      {/* List */}
      <GoalMessageList id={props.id} sx={{ mt: 4 }} />
    </Box>
  );
}
