import { Dialog } from "@mui/material";
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
        <GoalShareActions id={props.id} />
      </DialogCenterContent>
    </Dialog>
  );
}
