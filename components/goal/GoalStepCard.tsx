import { ExpandMore, Person } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Stack } from "@mui/system";
import { CardBox, LLoadingButton } from "components/styled";
import { GOAL_STEPS } from "constants/goalSteps";
import { VERIFICATION_DATA_KEYS } from "constants/verifiers";
import { DialogContext } from "context/dialog";
import GoalStepEntity from "entities/subgraph/GoalStepEntity";
import GoalMessageUriDataEntity from "entities/uri/GoalMessageUriDataEntity";
import GoalMotivatorUriDataEntity from "entities/uri/GoalMotivatorUriDataEntity";
import ProofDocumentsUriDataEntity from "entities/uri/ProofDocumentsUriDataEntity";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import { useContext, useEffect, useState } from "react";
import { theme } from "theme";
import { palette } from "theme/palette";
import { emojiAvatarForAddress } from "utils/avatars";
import {
  addressToShortAddress,
  ipfsUriToHttpUri,
  stringTimestampToLocaleString,
  timestampToLocaleString,
} from "utils/converters";
import { useAccount } from "wagmi";
import GoalAcceptMotivatorDialog from "./GoalAcceptMotivatorDialog";

interface CardParams {
  readonly backgoundColor?: string;
  readonly borderColor?: string;
  readonly isBackgroundDark?: boolean;
  readonly contentHeader?: string;
  readonly contentComponent?: any;
}

/**
 * A component with a goal step card.
 */
export default function GoalStepCard(props: {
  authorAddress: string;
  isClosed: boolean;
  step: GoalStepEntity;
  onUpdate: Function;
}) {
  const { address } = useAccount();

  const availableCardParams: { [key: string]: CardParams } = {
    [GOAL_STEPS.goalSet]: {
      backgoundColor: palette.blue,
      borderColor: palette.blue,
      isBackgroundDark: true,
      contentHeader: "Set the goal 🔥",
    },
    [GOAL_STEPS.motivatorAdded]: {
      borderColor: palette.purpleLight,
      contentHeader: "Sent a motivational message:",
      contentComponent: (
        <ContentMotivatorAdded
          authorAddress={props.authorAddress}
          isClosed={props.isClosed}
          step={props.step}
          onUpdate={props.onUpdate}
        />
      ),
    },
    [GOAL_STEPS.motivatorAccepted]: {
      backgoundColor: palette.purpleLight,
      borderColor: palette.purpleLight,
      isBackgroundDark: true,
      contentHeader: "Accepted a motivator:",
      contentComponent: <ContentMotivatorAccepted step={props.step} />,
    },
    [GOAL_STEPS.messagePosted]: {
      contentComponent: <ContentMessagePosted step={props.step} />,
    },
    [GOAL_STEPS.verificationDataSet]: {
      contentHeader: "Updated proofs:",
      contentComponent: <ContentCardVerificationDataSet step={props.step} />,
    },
    [GOAL_STEPS.goalVerifiedAsAchieved]: {
      borderColor: palette.green,
      contentHeader: "Verified the goal as achieved 👍",
    },
    [GOAL_STEPS.goalVerifiedAsFailed]: {
      borderColor: palette.green,
      contentHeader: "Verified the goal as failed 👎",
    },
    [GOAL_STEPS.goalClosedAsAchieved]: {
      backgoundColor: palette.green,
      borderColor: palette.green,
      isBackgroundDark: true,
      contentHeader: "Closed the goal as achieved 💪",
    },
    [GOAL_STEPS.goalClosedAsFailed]: {
      backgoundColor: palette.red,
      borderColor: palette.red,
      isBackgroundDark: true,
      contentHeader: "Closed the goal as failed 😥",
    },
  };

  const cardParams: CardParams = {
    backgoundColor:
      availableCardParams[props.step.type]?.backgoundColor ||
      theme.palette.background.default,
    borderColor:
      availableCardParams[props.step.type]?.borderColor ||
      theme.palette.divider,
    isBackgroundDark: availableCardParams[props.step.type]?.isBackgroundDark,
    contentHeader: availableCardParams[props.step.type]
      ? availableCardParams[props.step.type]?.contentHeader
      : "Took an unusual step 😲",
    contentComponent: availableCardParams[props.step.type]?.contentComponent,
  };

  return (
    <CardBox
      sx={{
        display: "flex",
        flexDirection: "row",
        background: cardParams.backgoundColor,
        borderColor: cardParams.borderColor,
      }}
    >
      <Box>
        {/* Avatar */}
        <Avatar
          sx={{
            width: 36,
            height: 36,
            borderRadius: 36,
            background: emojiAvatarForAddress(props.step.authorAddress).color,
          }}
        >
          <Typography>
            {emojiAvatarForAddress(props.step.authorAddress).emoji}
          </Typography>
        </Avatar>
      </Box>
      <Box width={1} ml={1.5}>
        {/* Account */}
        <Stack direction="row" spacing={1} alignItems="center">
          <MuiLink
            href={`/accounts/${props.step.authorAddress}`}
            color={
              cardParams.isBackgroundDark
                ? theme.palette.primary.contrastText
                : theme.palette.primary.main
            }
            fontWeight={700}
            variant="body2"
          >
            {addressToShortAddress(props.step.authorAddress)}
          </MuiLink>
          {address?.toLowerCase() ===
            props.step.authorAddress.toLowerCase() && (
            <Typography
              color={cardParams.isBackgroundDark ? grey[300] : "text.secondary"}
              fontWeight={700}
              variant="body2"
            >
              (you)
            </Typography>
          )}
        </Stack>
        {/* Date */}
        <Typography
          color={cardParams.isBackgroundDark ? grey[300] : "text.secondary"}
          variant="body2"
        >
          {stringTimestampToLocaleString(props.step.createdTimestamp)}
        </Typography>
        {/* Content header */}
        {cardParams.contentHeader && (
          <Typography
            color={
              cardParams.isBackgroundDark
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary
            }
            fontWeight={700}
            mt={1}
          >
            {cardParams.contentHeader}
          </Typography>
        )}
        {/* Content component */}
        {cardParams.contentComponent}
      </Box>
    </CardBox>
  );
}

function ContentMotivatorAdded(props: {
  authorAddress: string;
  isClosed: boolean;
  step: GoalStepEntity;
  onUpdate: Function;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { address } = useAccount();
  const { loadJsonFromIpfs } = useIpfs();
  const { handleError } = useError();
  const [motivatorUriData, setMotivatorUriData] = useState<
    GoalMotivatorUriDataEntity | undefined
  >();

  useEffect(() => {
    loadJsonFromIpfs(props.step.extraDataUri)
      .then((result) => setMotivatorUriData(result))
      .catch((error) => handleError(error, true));
  }, []);

  return (
    <Box>
      <Typography variant="body2" mt={1}>
        {motivatorUriData?.message || "..."}
      </Typography>
      {!props.isClosed && address === props.authorAddress && (
        <LLoadingButton
          variant="outlined"
          onClick={() =>
            showDialog?.(
              <GoalAcceptMotivatorDialog
                id={props.step.goal.id}
                motivatorAccountAddress={props.step.authorAddress}
                onSuccess={props.onUpdate}
                onClose={closeDialog}
              />
            )
          }
          sx={{ mt: 2 }}
        >
          Accept
        </LLoadingButton>
      )}
    </Box>
  );
}

function ContentMotivatorAccepted(props: { step: GoalStepEntity }) {
  const { address } = useAccount();

  const motivatorAccountAddress = props.step.extraData.split("=")[1];

  return (
    <Stack direction="row" spacing={1} alignItems="center" mt={1}>
      <Avatar
        sx={{
          width: 24,
          height: 24,
          borderRadius: 24,
          background: emojiAvatarForAddress(motivatorAccountAddress).color,
        }}
      >
        <Typography>
          {emojiAvatarForAddress(motivatorAccountAddress).emoji}
        </Typography>
      </Avatar>
      <MuiLink
        href={`/accounts/${motivatorAccountAddress}`}
        color={theme.palette.primary.contrastText}
        fontWeight={700}
        variant="body2"
      >
        {addressToShortAddress(motivatorAccountAddress)}
      </MuiLink>
      {address?.toLowerCase() === motivatorAccountAddress.toLowerCase() && (
        <Typography color={grey[300]} fontWeight={700} variant="body2">
          (you)
        </Typography>
      )}
    </Stack>
  );
}

function ContentMessagePosted(props: { step: GoalStepEntity }) {
  const { loadJsonFromIpfs } = useIpfs();
  const { handleError } = useError();
  const [messageUriData, setMessageUriData] = useState<
    GoalMessageUriDataEntity | undefined
  >();

  useEffect(() => {
    loadJsonFromIpfs(props.step.extraDataUri)
      .then((result) => setMessageUriData(result))
      .catch((error) => handleError(error, true));
  }, []);

  return (
    <Typography variant="body2" mt={1}>
      {messageUriData?.message || "..."}
    </Typography>
  );
}

function ContentCardVerificationDataSet(props: { step: GoalStepEntity }) {
  const verificationData = props.step.extraData.split("=");
  const verificationDataKey = verificationData[0];
  const verificationDataValue = verificationData[1];

  return (
    <Box mt={1}>
      {verificationDataKey === VERIFICATION_DATA_KEYS.anyProofUri &&
      verificationDataValue ? (
        <ContentVerificationDataSetAnyProofUri
          anyProofUriData={verificationDataValue}
        />
      ) : (
        <Typography variant="body2">
          There is a problem with the display of proofs, try again later
        </Typography>
      )}
    </Box>
  );
}

function ContentVerificationDataSetAnyProofUri(props: {
  anyProofUriData: string;
}) {
  const { handleError } = useError();
  const { loadJsonFromIpfs } = useIpfs();
  const [proofDocuments, setProofDocuments] = useState<
    ProofDocumentsUriDataEntity | undefined
  >();

  useEffect(() => {
    loadJsonFromIpfs(props.anyProofUriData)
      .then((result) =>
        setProofDocuments({ documents: result.documents || [] })
      )
      .catch((error) => handleError(error, true));
  }, []);

  if (!proofDocuments) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      {proofDocuments.documents.map((document, index) => (
        <Accordion key={index} disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack spacing={0.5}>
              <Typography variant="body2">📃 {document.description}</Typography>
              {document.addedData && (
                <Typography variant="body2" color="text.secondary">
                  {timestampToLocaleString(document.addedData, true)}
                </Typography>
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              <MuiLink
                href={ipfsUriToHttpUri(document.uri || "")}
                target="_blank"
                mt={1}
              >
                Link #1 (HTTP)
              </MuiLink>
              <MuiLink href={document.uri || ""} target="_blank" mt={1}>
                Link #2 (IPFS)
              </MuiLink>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
