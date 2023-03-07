import { Link as MuiLink, Stack, SxProps, Typography } from "@mui/material";
import { CardBox } from "components/styled";
import GoalEntity from "entities/GoalEntity";
import { BigNumber, ethers } from "ethers";
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
        <Typography>
          👤{" "}
          <MuiLink href={`/accounts/${props.goal.authorAddress}`}>
            <strong>{addressToShortAddress(props.goal.authorAddress)}</strong>
          </MuiLink>
        </Typography>
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
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ lineBreak: "anywhere" }}
        >
          {props.goal.description}
        </Typography>
      </Stack>
      {/* Watchers, stake, deadline */}
      <Stack
        sx={{
          alignItems: { md: "flex-end" },
          justifyContent: "center",
          ml: { md: 6 },
          minWidth: { md: 120 },
        }}
      >
        <Typography fontWeight={700}>{props.goal.watchersNumber} 👥</Typography>
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
