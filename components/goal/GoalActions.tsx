import { SxProps } from "@mui/material";
import { Stack } from "@mui/system";
import { XlLoadingButton } from "components/styled";
import {
  VERIFICATION_DATA_KEYS,
  VERIFICATION_REQUIREMENTS,
} from "constants/verifiers";
import { DialogContext } from "context/dialog";
import { goalContractAbi } from "contracts/abi/goalContract";
import ProofDocumentsUriDataEntity from "entities/uri/ProofDocumentsUriDataEntity";
import { BigNumber } from "ethers";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import { useContext, useEffect, useState } from "react";
import { chainToSupportedChainGoalContractAddress } from "utils/chains";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import GoalAddProofDocumentDialog from "./GoalAddProofDocumentDialog";
import GoalBecomeMotivatorDialog from "./GoalBecomeMotivatorDialog";
import GoalCloseDialog from "./GoalCloseDialog";
import GoalPostMessageDialog from "./GoalPostMessageDialog";

/**
 * A component with goal actions.
 */
export default function GoalActions(props: {
  id: string;
  authorAddress: string;
  deadlineTimestamp: BigNumber;
  verificationRequirement: string;
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
      <MessagePostButton id={props.id} onSuccess={() => props.onSuccess?.()} />
      {address !== props.authorAddress && (
        <MotivatorBecomeButton
          id={props.id}
          onSuccess={() => props.onSuccess?.()}
        />
      )}
      {address === props.authorAddress && (
        <ProofAddButton
          id={props.id}
          verificationRequirement={props.verificationRequirement}
          onSuccess={() => props.onSuccess?.()}
        />
      )}
      <GoalCloseButton
        id={props.id}
        deadlineTimestamp={props.deadlineTimestamp}
        verificationRequirement={props.verificationRequirement}
        onSuccess={() => props.onSuccess?.()}
      />
    </Stack>
  );
}

function MessagePostButton(props: { id: string; onSuccess?: Function }) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <XlLoadingButton
      variant="contained"
      onClick={() =>
        showDialog?.(
          <GoalPostMessageDialog
            id={props.id}
            onSuccess={props.onSuccess}
            onClose={closeDialog}
          />
        )
      }
    >
      Post Message
    </XlLoadingButton>
  );
}

function MotivatorBecomeButton(props: { id: string; onSuccess?: Function }) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <XlLoadingButton
      variant="outlined"
      onClick={() =>
        showDialog?.(
          <GoalBecomeMotivatorDialog
            id={props.id}
            onSuccess={props.onSuccess}
            onClose={closeDialog}
          />
        )
      }
    >
      Become Motivator
    </XlLoadingButton>
  );
}

function ProofAddButton(props: {
  id: string;
  verificationRequirement: string;
  onSuccess?: Function;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { chain } = useNetwork();
  const { handleError } = useError();
  const { loadJsonFromIpfs } = useIpfs();
  const [proofDocuments, setProofDocuments] = useState<
    ProofDocumentsUriDataEntity | undefined
  >();

  // State of contract reading to get goal verification data
  const {
    data: goalVerificationData,
    refetch: refetchGoalVerificationData,
    isFetching: isGoalVerificationDataFetching,
  } = useContractRead({
    address: chainToSupportedChainGoalContractAddress(chain),
    abi: goalContractAbi,
    functionName: "getVerificationDataList",
    args: [BigNumber.from(props.id), [VERIFICATION_DATA_KEYS.anyProofUri]],
  });

  /**
   * Use loaded verification data to define proofs to edit.
   */
  useEffect(() => {
    if (goalVerificationData && !isGoalVerificationDataFetching) {
      if (
        props.verificationRequirement === VERIFICATION_REQUIREMENTS.anyProofUri
      ) {
        const anyProofUri = goalVerificationData[0];
        if (anyProofUri !== "") {
          loadJsonFromIpfs(anyProofUri)
            .then((result) =>
              setProofDocuments({ documents: result.documents || [] })
            )
            .catch((error) => handleError(error, true));
        } else {
          setProofDocuments({ documents: [] });
        }
      }
    }
  }, [goalVerificationData, isGoalVerificationDataFetching]);

  if (
    isGoalVerificationDataFetching ||
    !goalVerificationData ||
    !proofDocuments
  ) {
    return <></>;
  }

  return (
    <XlLoadingButton
      variant="outlined"
      onClick={() =>
        showDialog?.(
          <GoalAddProofDocumentDialog
            id={props.id}
            verificationRequirement={props.verificationRequirement}
            proofDocuments={proofDocuments}
            onSuccess={() => {
              refetchGoalVerificationData();
              props.onSuccess?.();
            }}
            onClose={closeDialog}
          />
        )
      }
    >
      Add Proof
    </XlLoadingButton>
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
      variant="outlined"
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
