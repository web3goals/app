import { Box, SxProps, Typography } from "@mui/material";
import {
  FullWidthSkeleton,
  WidgetSeparatorText,
  XlLoadingButton,
} from "components/styled";
import {
  VERIFICATION_DATA_KEYS,
  VERIFICATION_REQUIREMENTS,
} from "constants/verifiers";
import { DialogContext } from "context/dialog";
import { goalContractAbi } from "contracts/abi/goalContract";
import ProofDocumentsUriDataEntity from "entities/ProofDocumentsUriDataEntity";
import { BigNumber } from "ethers";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import { useContext, useEffect, useState } from "react";
import { getGoalContractAddress } from "utils/chains";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import GoalAddProofDocumentDialog from "./GoalAddProofDocumentDialog";
import GoalProofDocumentsList from "./GoalProofDocumentsList";

/**
 * A component with goal proofs.
 */
export default function GoalProofs(props: {
  id: string;
  authorAddress: string;
  isClosed: boolean;
  verificationRequirement: string;
  onUpdate?: Function;
  sx?: SxProps;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { chain } = useNetwork();
  const { address } = useAccount();
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
    address: getGoalContractAddress(chain),
    abi: goalContractAbi,
    functionName: "getVerificationDataList",
    args: [BigNumber.from(props.id), [VERIFICATION_DATA_KEYS.anyProofUri]],
  });

  /**
   * Use loaded verification data to define proofs to display.
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
        📃 Proofs
      </Typography>
      <WidgetSeparatorText mt={2}>
        added by the author of this goal
      </WidgetSeparatorText>
      {/* Components if proof documents defined */}
      {proofDocuments && (
        <>
          {/* Button to add proof */}
          {!props.isClosed && address === props.authorAddress && (
            <XlLoadingButton
              variant="contained"
              onClick={() =>
                showDialog?.(
                  <GoalAddProofDocumentDialog
                    id={props.id}
                    verificationRequirement={props.verificationRequirement}
                    proofDocuments={proofDocuments}
                    onSuccess={() => {
                      refetchGoalVerificationData();
                      props.onUpdate?.();
                    }}
                    onClose={closeDialog}
                  />
                )
              }
              sx={{ mt: 4 }}
            >
              Add
            </XlLoadingButton>
          )}
          {/* Proof list */}
          <GoalProofDocumentsList
            proofDocuments={proofDocuments}
            sx={{ mt: 4 }}
          />
        </>
      )}
      {!proofDocuments && <FullWidthSkeleton sx={{ mt: 4 }} />}
    </Box>
  );
}
