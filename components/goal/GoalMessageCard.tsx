import {
  Box,
  Divider,
  Link as MuiLink,
  Tooltip,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Stack } from "@mui/system";
import AccountAvatar from "components/account/AccountAvatar";
import AccountLink from "components/account/AccountLink";
import { CardBox, MediumLoadingButton } from "components/styled";
import { GOAL_MESSAGES } from "constants/goal/messages";
import { DialogContext } from "context/dialog";
import GoalMessageEntity from "entities/subgraph/GoalMessageEntity";
import GoalMessageUriDataEntity from "entities/uri/GoalMessageUriDataEntity";
import ProfileUriDataEntity from "entities/uri/ProfileUriDataEntity";
import useAccountsFinder from "hooks/subgraph/useAccountsFinder";
import useUriDataLoader from "hooks/useUriDataLoader";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { theme } from "theme";
import { palette } from "theme/palette";
import { isAddressesEqual } from "utils/addresses";
import {
  ipfsUriToHttpUri,
  stringTimestampToLocaleString,
  timestampToLocaleDateString,
  timestampToLocaleString,
} from "utils/converters";
import { useAccount, useNetwork } from "wagmi";
import GoalEvaluateMessageDialog from "./dialog/GoalEvaluateMessageDialog";

interface CardParams {
  readonly backgoundColor?: string;
  readonly borderColor?: string;
  readonly isBackgroundDark?: boolean;
  readonly contentHeader?: string;
  readonly contentComponent?: any;
}

/**
 * A component with a goal message card.
 */
export default function GoalMessageCard(props: {
  message: GoalMessageEntity;
  displayGoalLink?: boolean;
  onUpdate: Function;
}) {
  const { chain } = useNetwork();
  const { data: authorAccounts } = useAccountsFinder({
    chain: chain,
    id: props.message.authorAddress,
  });
  const { data: authorProfileUriData } = useUriDataLoader<ProfileUriDataEntity>(
    authorAccounts?.[0]?.profileUri
  );

  const availableCardParams: { [key: string]: CardParams } = {
    [GOAL_MESSAGES.goalSet]: {
      backgoundColor: palette.blue,
      borderColor: palette.blue,
      isBackgroundDark: true,
      contentHeader: "Set the goal 🔥",
    },
    [GOAL_MESSAGES.proofPosted]: {
      backgoundColor: palette.purpleLight,
      borderColor: palette.purpleLight,
      isBackgroundDark: true,
      contentHeader: "Posted proof:",
      contentComponent: <ContentProofPosted message={props.message} />,
    },
    [GOAL_MESSAGES.messagePosted]: {
      borderColor: palette.divider,
      contentComponent: (
        <ContentMessagePosted
          message={props.message}
          onUpdate={props.onUpdate}
        />
      ),
    },
    [GOAL_MESSAGES.goalClosedAsAchieved]: {
      backgoundColor: palette.green,
      borderColor: palette.green,
      isBackgroundDark: true,
      contentHeader: "Closed the goal as achieved 💪",
    },
    [GOAL_MESSAGES.goalClosedAsFailed]: {
      backgoundColor: palette.red,
      borderColor: palette.red,
      isBackgroundDark: true,
      contentHeader: "Closed the goal as failed 😥",
    },
  };

  const cardParams: CardParams = {
    backgoundColor:
      availableCardParams[props.message.type]?.backgoundColor ||
      theme.palette.background.default,
    borderColor:
      availableCardParams[props.message.type]?.borderColor ||
      theme.palette.divider,
    isBackgroundDark: availableCardParams[props.message.type]?.isBackgroundDark,
    contentHeader: availableCardParams[props.message.type]
      ? availableCardParams[props.message.type]?.contentHeader
      : "Sent an unusual message 😲",
    contentComponent: availableCardParams[props.message.type]?.contentComponent,
  };

  return (
    <CardBox
      sx={{
        background: cardParams.backgoundColor,
        borderColor: cardParams.borderColor,
      }}
    >
      {/* Goal link */}
      {props.displayGoalLink && (
        <>
          <Typography
            variant="body2"
            color={cardParams.isBackgroundDark ? grey[300] : "text.secondary"}
            mb={0.5}
          >
            🔥 Goal #{props.message.goal.id}
          </Typography>
          <Link
            href={`/goals/${props.message.goal.id}`}
            passHref
            legacyBehavior
          >
            <MuiLink
              fontWeight={700}
              color={
                cardParams.isBackgroundDark
                  ? theme.palette.primary.contrastText
                  : theme.palette.primary.main
              }
            >
              {props.message.goal.description}
            </MuiLink>
          </Link>
          <Divider sx={{ mt: 1, mb: 2 }} />
        </>
      )}
      {/* Message params */}
      <Box display="flex" flexDirection="row">
        {/* Left part */}
        <Box>
          <AccountAvatar
            account={props.message.authorAddress}
            accountProfileUriData={authorProfileUriData}
          />
        </Box>
        {/* Right part */}
        <Box width={1} ml={1.5}>
          {/* Account */}
          <AccountLink
            account={props.message.authorAddress}
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
            {stringTimestampToLocaleString(props.message.addedTimestamp)}
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
      </Box>
    </CardBox>
  );
}

function ContentProofPosted(props: { message: GoalMessageEntity }) {
  const { data: proofUriData } = useUriDataLoader<GoalMessageUriDataEntity>(
    props.message.extraDataUri
  );

  if (!proofUriData) {
    return (
      <Typography variant="body2" mt={1}>
        {"..."}
      </Typography>
    );
  }

  return (
    <Box mt={1}>
      <Typography color="primary.contrastText">{proofUriData.text}</Typography>
      {proofUriData.attachment?.type === "IMAGE" && (
        <Box mt={1}>
          <Link
            href={ipfsUriToHttpUri(proofUriData.attachment?.uri)}
            target="_blank"
          >
            <Image
              src={ipfsUriToHttpUri(proofUriData.attachment?.uri)}
              alt="Proof"
              width="100"
              height="100"
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px ",
              }}
            />
          </Link>
        </Box>
      )}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 0.5, md: 2 }}
        mt={1}
      >
        <MuiLink
          href={ipfsUriToHttpUri(proofUriData.attachment?.uri)}
          target="_blank"
          variant="body2"
          color="primary.contrastText"
        >
          🔗 HTTP LINK
        </MuiLink>
        <MuiLink
          href={proofUriData.attachment?.uri || ""}
          target="_blank"
          variant="body2"
          color="primary.contrastText"
        >
          🔗 IPFS LINK
        </MuiLink>
        <Tooltip
          title={timestampToLocaleString(
            proofUriData.attachment?.addedData,
            true
          )}
        >
          <Typography
            variant="body2"
            color="primary.contrastText"
            sx={{ cursor: "help" }}
          >
            {timestampToLocaleDateString(
              proofUriData.attachment?.addedData,
              true
            )}
          </Typography>
        </Tooltip>
      </Stack>
    </Box>
  );
}

function ContentMessagePosted(props: {
  message: GoalMessageEntity;
  onUpdate: Function;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { address } = useAccount();
  const { data: messageUriData } = useUriDataLoader<GoalMessageUriDataEntity>(
    props.message.extraDataUri
  );

  return (
    <Box mt={1}>
      {/* Text */}
      <Typography>{messageUriData?.text || "..."}</Typography>
      {/* Evaluation */}
      {props.message.isMotivating && (
        <Typography variant="body2" color="yellow" mt={1}>
          ⭐ It’s motivating!
        </Typography>
      )}
      {props.message.isSuperMotivating && (
        <Typography variant="body2" color="orange" mt={1}>
          🌟 It’s super motivating!
        </Typography>
      )}
      {/* Button for evaluation */}
      {!props.message.goal.isClosed &&
        !props.message.isMotivating &&
        !props.message.isSuperMotivating &&
        isAddressesEqual(address, props.message.goal.authorAddress) &&
        !isAddressesEqual(address, props.message.authorAddress) && (
          <MediumLoadingButton
            variant="outlined"
            onClick={() =>
              showDialog?.(
                <GoalEvaluateMessageDialog
                  id={props.message.goal.id}
                  messageId={props.message.messageId}
                  onSuccess={props.onUpdate}
                  onClose={closeDialog}
                />
              )
            }
            sx={{ mt: 2 }}
          >
            It’s motivating
          </MediumLoadingButton>
        )}
    </Box>
  );
}
