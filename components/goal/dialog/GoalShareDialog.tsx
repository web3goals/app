import { Dialog, Typography } from "@mui/material";
import GoalShareActions from "components/goal/GoalShareActions";
import { DialogCenterContent } from "components/styled";
import { useState } from "react";

/**
 * Dialog to share a goal.
 */
export default function GoalShareDialog(props: {
  id: string;
  isClose?: boolean;
  onClose?: Function;
}) {
  const [isOpen, setIsOpen] = useState(!props.isClose);

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogCenterContent>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          🗣️ Share the goal
        </Typography>
        <Typography textAlign="center" mt={1}>
          with your friends and followers
        </Typography>
        <GoalShareActions id={props.id} sx={{ mt: 3 }} />
      </DialogCenterContent>
    </Dialog>
  );
}
