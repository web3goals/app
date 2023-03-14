import { Link as MuiLink, SxProps, Typography } from "@mui/material";
import { CardBox } from "components/styled";
import ProofDocumentsUriDataEntity from "entities/uri/ProofDocumentsUriDataEntity";
import { ipfsUriToHttpUri } from "utils/converters";

/**
 * A component with card for goal proof document.
 */
export default function GoalProofDocumentCard(props: {
  proofDocuments: ProofDocumentsUriDataEntity;
  proofDocumentIndex: number;
  sx?: SxProps;
}) {
  const document = props.proofDocuments.documents[props.proofDocumentIndex];

  return (
    <CardBox display="flex" flexDirection="column" sx={{ ...props.sx }}>
      <Typography fontWeight={700}>{document.description}</Typography>
      <MuiLink
        href={ipfsUriToHttpUri(document.uri || "")}
        target="_blank"
        mt={1}
      >
        Link #1 (HTTP)
      </MuiLink>
      <MuiLink href={document.uri} target="_blank" mt={0.5}>
        Link #2 (IPFS)
      </MuiLink>
    </CardBox>
  );
}
