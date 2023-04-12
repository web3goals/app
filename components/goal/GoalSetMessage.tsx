import { Typography } from "@mui/material";
import { ThickDivider } from "components/styled";
import GoalShareActions from "./GoalShareActions";

/**
 * A component with message that goal is set.
 */
export default function GoalSetMessage(props: { id: string }) {
  return (
    <>
      <Typography variant="h4" textAlign="center" fontWeight={700}>
        🤟 Congrats, you set a goal!
      </Typography>
      <ThickDivider sx={{ mt: 5 }} />
      <GoalShareActions
        id={props.id}
        text="🗣️ Share the link with your friends and followers, they may want to be your motivators"
        sx={{ mt: 6 }}
      />
    </>
  );
}
