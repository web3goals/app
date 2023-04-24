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
      <ThickDivider sx={{ mt: 4, mb: 4 }} />
      <Typography textAlign="center">
        Share the link with your friends and followers
      </Typography>
      <Typography textAlign="center" mt={1}>
        That way they will be able to know about your goal and inspire you with
        motivational messages
      </Typography>
      <GoalShareActions id={props.id} sx={{ mt: 3 }} />
    </>
  );
}
