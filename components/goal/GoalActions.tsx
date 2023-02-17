import { SxProps } from "@mui/material";
import { Stack } from "@mui/system";
import GoalShareDialog from "components/goal/GoalShareDialog";
import { XlLoadingButton } from "components/styled";
import { DialogContext } from "context/dialog";
import { BigNumber } from "ethers";
import { useContext } from "react";
import GoalCloseDialog from "./GoalCloseDialog";

/**
 * A component with goal actions.
 */
export default function GoalActions(props: {
  id: string;
  deadlineTimestamp: BigNumber;
  verificationRequirement: string;
  isClosed: boolean;
  onSuccess: Function;
  sx?: SxProps;
}) {
  return (
    <Stack
      direction="column"
      spacing={2}
      justifyContent="center"
      sx={{ ...props.sx }}
    >
      {!props.isClosed && (
        <GoalCloseButton
          id={props.id}
          deadlineTimestamp={props.deadlineTimestamp}
          verificationRequirement={props.verificationRequirement}
          onSuccess={() => props.onSuccess?.()}
        />
      )}
      <GoalShareButton id={props.id} />
    </Stack>
  );
}

function GoalCloseButton(props: {
  id: string;
  deadlineTimestamp: BigNumber;
  verificationRequirement: string;
  onSuccess?: Function;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <XlLoadingButton
      variant="contained"
      onClick={() =>
        showDialog?.(
          <GoalCloseDialog
            id={props.id}
            deadlineTimestamp={props.deadlineTimestamp}
            verificationRequirement={props.verificationRequirement}
            onSuccess={props.onSuccess}
            onClose={closeDialog}
          />
        )
      }
    >
      Close
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
