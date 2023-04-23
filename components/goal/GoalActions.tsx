import { SxProps } from "@mui/material";
import { Stack } from "@mui/system";
import { LargeLoadingButton } from "components/styled";
import { DialogContext } from "context/dialog";
import { BigNumber } from "ethers";
import { useContext } from "react";
import { useAccount } from "wagmi";
import GoalCloseDialog from "./dialog/GoalCloseDialog";
import GoalPostMessageDialog from "./dialog/GoalPostMessageDialog";
import GoalPostProofDialog from "./dialog/GoalPostProofDialog";

/**
 * A component with goal actions.
 */
export default function GoalActions(props: {
  id: string;
  authorAddress: string;
  deadlineTimestamp: BigNumber;
  isClosed: boolean;
  onSuccess: Function;
  sx?: SxProps;
}) {
  const { address } = useAccount();

  if (props.isClosed) {
    return <></>;
  }

  return (
    <Stack
      direction="column"
      spacing={2}
      justifyContent="center"
      sx={{ ...props.sx }}
    >
      <MessagePostButton
        id={props.id}
        authorAddress={props.authorAddress}
        onSuccess={() => props.onSuccess?.()}
      />
      {address === props.authorAddress && (
        <ProofPostButton id={props.id} onSuccess={() => props.onSuccess?.()} />
      )}
      <GoalCloseButton
        id={props.id}
        authorAddress={props.authorAddress}
        deadlineTimestamp={props.deadlineTimestamp}
        onSuccess={() => props.onSuccess?.()}
      />
    </Stack>
  );
}

function MessagePostButton(props: {
  id: string;
  authorAddress: string;
  onSuccess?: Function;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <LargeLoadingButton
      variant="contained"
      onClick={() =>
        showDialog?.(
          <GoalPostMessageDialog
            id={props.id}
            authorAddress={props.authorAddress}
            onSuccess={props.onSuccess}
            onClose={closeDialog}
          />
        )
      }
    >
      Post Message
    </LargeLoadingButton>
  );
}

function ProofPostButton(props: { id: string; onSuccess?: Function }) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <LargeLoadingButton
      variant="outlined"
      onClick={() =>
        showDialog?.(
          <GoalPostProofDialog
            id={props.id}
            onSuccess={props.onSuccess}
            onClose={closeDialog}
          />
        )
      }
    >
      Post Proof
    </LargeLoadingButton>
  );
}

function GoalCloseButton(props: {
  id: string;
  authorAddress: string;
  deadlineTimestamp: BigNumber;
  onSuccess?: Function;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <LargeLoadingButton
      variant="outlined"
      onClick={() =>
        showDialog?.(
          <GoalCloseDialog
            id={props.id}
            authorAddress={props.authorAddress}
            deadlineTimestamp={props.deadlineTimestamp}
            onSuccess={props.onSuccess}
            onClose={closeDialog}
          />
        )
      }
    >
      Close
    </LargeLoadingButton>
  );
}
