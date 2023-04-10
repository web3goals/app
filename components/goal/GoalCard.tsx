import {
  Avatar,
  Box,
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
import { useAccount, useNetwork } from "wagmi";

/**
 * A component with a goal card.
 */
export default function GoalCard(props: { goal: GoalEntity; sx?: SxProps }) {
  const { chain } = useNetwork();
  const { address } = useAccount();

  return (
    <CardBox
      sx={{
        display: "flex",
        flexDirection: "row",
        borderColor: !props.goal.isClosed
          ? "yellow"
          : props.goal.isAchieved
          ? "green"
          : "red",
        ...props.sx,
      }}
    >
      {/* Left part */}
      <Box>
        {/* Avatar */}
        <Avatar
          sx={{
            width: 36,
            height: 36,
            borderRadius: 36,
            background: emojiAvatarForAddress(props.goal.authorAddress).color,
          }}
        >
          <Typography>
            {emojiAvatarForAddress(props.goal.authorAddress).emoji}
          </Typography>
        </Avatar>
      </Box>
      {/* Right part */}
      <Box width={1} ml={1.5} display="flex" flexDirection="column">
        {/* Account */}
        <Stack direction="row" spacing={1} alignItems="center">
          <MuiLink
            href={`/accounts/${props.goal.authorAddress}`}
            fontWeight={700}
            variant="body2"
          >
            {addressToShortAddress(props.goal.authorAddress)}
          </MuiLink>
          {address?.toLowerCase() ===
            props.goal.authorAddress.toLowerCase() && (
            <Typography color="text.secondary" fontWeight={700} variant="body2">
              (you)
            </Typography>
          )}
        </Stack>
        {/* Description */}
        <MuiLink href={`/goals/${props.goal.id}`} fontWeight={700} mt={1.5}>
          {props.goal.description}
        </MuiLink>
        {/* Details */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 0.5, md: 2 }}
          alignItems={{ md: "center" }}
          mt={1.5}
        >
          <Typography variant="body2" color="text.secondary">
            #{props.goal.id}
          </Typography>
          <Typography
            variant="body2"
            color={
              !props.goal.isClosed
                ? "yellow"
                : props.goal.isAchieved
                ? "green"
                : "red"
            }
          >
            {!props.goal.isClosed
              ? "Active"
              : props.goal.isAchieved
              ? "Achieved"
              : "Failed"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            By{" "}
            {bigNumberTimestampToLocaleDateString(
              BigNumber.from(props.goal.deadlineTimestamp)
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Staked{" "}
            {ethers.utils.formatEther(BigNumber.from(props.goal.authorStake))}{" "}
            {getChainNativeCurrencySymbol(chain)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.goal.motivatorsNumber} Motivators
          </Typography>
        </Stack>
      </Box>
    </CardBox>
  );
}
