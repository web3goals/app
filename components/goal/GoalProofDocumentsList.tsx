import { Box, Stack, SxProps, Typography } from "@mui/material";
import { CardBox, FullWidthSkeleton } from "components/styled";
import ProofDocumentsUriDataEntity from "entities/uri/ProofDocumentsUriDataEntity";
import GoalProofDocumentCard from "./GoalProofDocumentCard";

/**
 * A component with goal proof documents list.
 *
 * TODO: Delete component
 */
export default function GoalProofDocumentsList(props: {
  proofDocuments: ProofDocumentsUriDataEntity | undefined;
  sx?: SxProps;
}) {
  return (
    <Box sx={{ width: 1, ...props.sx }}>
      {/* List with proof documents */}
      {props.proofDocuments?.documents &&
        props.proofDocuments.documents.length > 0 && (
          <Stack spacing={2}>
            {props.proofDocuments.documents.map((_, index) => (
              <GoalProofDocumentCard
                key={index}
                proofDocuments={props.proofDocuments!}
                proofDocumentIndex={index}
              />
            ))}
          </Stack>
        )}
      {/* Empty list */}
      {props.proofDocuments?.documents &&
        props.proofDocuments.documents.length === 0 && (
          <CardBox>
            <Typography textAlign="center">😐 no proofs</Typography>
          </CardBox>
        )}
      {/* Loading list */}
      {!props.proofDocuments && <FullWidthSkeleton />}
    </Box>
  );
}
