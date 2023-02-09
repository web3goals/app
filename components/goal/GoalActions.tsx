import { SxProps } from "@mui/material";
import { Stack } from "@mui/system";
import GoalShareDialog from "components/goal/GoalShareDialog";
import { XlLoadingButton } from "components/styled";
import { DialogContext } from "context/dialog";
import { useContext } from "react";
import GoalWatchDialog from "./GoalWatchDialog";

/**
 * A component with goal actions.
 */
export default function GoalActions(props: {
  id: string;
  isClosed: boolean;
  onUpdate: Function;
  sx?: SxProps;
}) {
  return (
    <Stack
      direction="column"
      spacing={2}
      justifyContent="center"
      sx={{ ...props.sx }}
    >
      <GoalWatchButton id={props.id} onSuccess={() => props.onUpdate?.()} />
      <GoalShareButton id={props.id} />
    </Stack>
  );
}

function GoalWatchButton(props: { id: string; onSuccess?: Function }) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <XlLoadingButton
      variant="contained"
      onClick={() =>
        showDialog?.(<GoalWatchDialog id={props.id} onClose={closeDialog} />)
      }
    >
      Watch
    </XlLoadingButton>
  );
}

function GoalShareButton(props: { id: string }) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <XlLoadingButton
      variant="outlined"
      onClick={() =>
        showDialog?.(<GoalShareDialog id={props.id} onClose={closeDialog} />)
      }
    >
      Share
    </XlLoadingButton>
  );
}
