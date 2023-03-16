import {
  Avatar,
  Link as MuiLink,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { CardBox } from "components/styled";
import GoalEntity from "entities/subgraph/GoalEntity";
import { BigNumber, ethers } from "ethers";
import { emojiAvatarForAddress } from "utils/avatars";
import { getChainNativeCurrencySymbol } from "utils/chains";
import {
  addressToShortAddress,
  bigNumberTimestampToLocaleDateString,
} from "utils/converters";
import { useNetwork } from "wagmi";

/**
 * A component with a goal card.
 */
export default function GoalCard(props: { goal: GoalEntity; sx?: SxProps }) {
  const { chain } = useNetwork();

  return (
    <CardBox
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        borderColor: !props.goal.isClosed
          ? "divider"
          : props.goal.isAchieved
          ? "success.main"
          : "error.main",
        ...props.sx,
      }}
    >
      {/* Link, author */}
      <Stack sx={{ justifyContent: "center" }}>
        <Typography>
          {!props.goal.isClosed ? "🔥" : props.goal.isAchieved ? "✅" : "❌"}{" "}
          <MuiLink href={`/goals/${props.goal.id}`}>
            <strong>#{props.goal.id}</strong>
          </MuiLink>
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              borderRadius: 24,
              background: emojiAvatarForAddress(props.goal.authorAddress).color,
            }}
          >
            <Typography>
              {emojiAvatarForAddress(props.goal.authorAddress).emoji}
            </Typography>
          </Avatar>
          <MuiLink
            href={`/accounts/${props.goal.authorAddress}`}
            fontWeight={700}
          >
            {addressToShortAddress(props.goal.authorAddress)}
          </MuiLink>
        </Stack>
      </Stack>
      {/* Description */}
      <Stack
        sx={{
          flex: 1,
          justifyContent: "center",
          ml: { md: 8 },
          my: { xs: 2, md: 0 },
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {props.goal.description}
        </Typography>
      </Stack>
      {/* Motivators, stake, deadline */}
      <Stack
        sx={{
          alignItems: { md: "flex-end" },
          justifyContent: "center",
          ml: { md: 6 },
          minWidth: { md: 120 },
        }}
      >
        <Typography fontWeight={700}>
          {props.goal.motivatorsNumber} 👥
        </Typography>
        <Typography fontWeight={700}>
          {ethers.utils.formatEther(BigNumber.from(props.goal.authorStake))}{" "}
          {getChainNativeCurrencySymbol(chain)}
        </Typography>
        <Typography fontWeight={700}>
          {bigNumberTimestampToLocaleDateString(
            BigNumber.from(props.goal.deadlineTimestamp)
          )}
        </Typography>
      </Stack>
    </CardBox>
  );
}
