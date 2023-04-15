import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Stack } from "@mui/system";
import AccountAvatar from "components/account/AccountAvatar";
import AccountLink from "components/account/AccountLink";
import { CardBox, MediumLoadingButton } from "components/styled";
import { GOAL_STEPS } from "constants/goalSteps";
import { VERIFICATION_DATA_KEYS } from "constants/verifiers";
import { DialogContext } from "context/dialog";
import GoalStepEntity from "entities/subgraph/GoalStepEntity";
import GoalMessageUriDataEntity from "entities/uri/GoalMessageUriDataEntity";
import ProofDocumentsUriDataEntity from "entities/uri/ProofDocumentsUriDataEntity";
import useAccountsFinder from "hooks/subgraph/useAccountsFinder";
import useGoalMotivatorUriDataLoader from "hooks/uriData/useGoalMotivatorUriDataLoader";
import useProfileUriDataLoader from "hooks/uriData/useProfileUriDataLoader";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import { useContext, useEffect, useState } from "react";
import { theme } from "theme";
import { palette } from "theme/palette";
import {
  ipfsUriToHttpUri,
  stringTimestampToLocaleString,
  timestampToLocaleString,
} from "utils/converters";
import { useAccount, useNetwork } from "wagmi";
import GoalAcceptMotivatorDialog from "./dialog/GoalAcceptMotivatorDialog";

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
  goalAuthorAddress: string;
  isGoalClosed: boolean;
  step: GoalStepEntity;
  onUpdate: Function;
}) {
  const { chain } = useNetwork();
  const { data: authorAccounts } = useAccountsFinder({
    chain: chain,
    id: props.step.authorAddress,
  });
  const { data: authorProfileUriData } = useProfileUriDataLoader(
    authorAccounts?.[0]?.profileUri
  );

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
          authorAddress={props.goalAuthorAddress}
          isClosed={props.isGoalClosed}
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
      {/* Left part */}
      <Box>
        <AccountAvatar
          account={props.step.authorAddress}
          accountProfileUriData={authorProfileUriData}
        />
      </Box>
      {/* Right part */}
      <Box width={1} ml={1.5}>
        {/* Account */}
        <AccountLink
          account={props.step.authorAddress}
          accountProfileUriData={authorProfileUriData}
          color={
            cardParams.isBackgroundDark
              ? theme.palette.primary.contrastText
              : theme.palette.primary.main
          }
        />
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
  const { data } = useGoalMotivatorUriDataLoader(props.step.extraDataUri);

  return (
    <Box>
      <Typography variant="body2" mt={1}>
        {data?.message || "..."}
      </Typography>
      {!props.isClosed && address === props.authorAddress && (
        <MediumLoadingButton
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
        </MediumLoadingButton>
      )}
    </Box>
  );
}

function ContentMotivatorAccepted(props: { step: GoalStepEntity }) {
  const { chain } = useNetwork();
  const motivatorAddress = props.step.extraData.split("=")[1];
  const { data: motivatorAccounts } = useAccountsFinder({
    chain: chain,
    id: motivatorAddress,
  });
  const { data: motivatorProfileUriData } = useProfileUriDataLoader(
    motivatorAccounts?.[0]?.profileUri
  );

  return (
    <Stack direction="row" spacing={1} alignItems="center" mt={1}>
      <AccountAvatar
        account={motivatorAddress}
        accountProfileUriData={motivatorProfileUriData}
        size={24}
        emojiSize={14}
      />
      <AccountLink
        account={motivatorAddress}
        accountProfileUriData={motivatorProfileUriData}
        color={theme.palette.primary.contrastText}
      />
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
