import {
  Box,
  Link as MuiLink,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import AccountAvatar from "components/account/AccountAvatar";
import AccountLink from "components/account/AccountLink";
import { CardBox } from "components/styled";
import GoalEntity from "entities/subgraph/GoalEntity";
import ProfileUriDataEntity from "entities/uri/ProfileUriDataEntity";
import { BigNumber, ethers } from "ethers";
import useAccountsFinder from "hooks/subgraph/useAccountsFinder";
import useUriDataLoader from "hooks/useUriDataLoader";
import { chainToSupportedChainNativeCurrencySymbol } from "utils/chains";
import { bigNumberTimestampToLocaleDateString } from "utils/converters";
import { useNetwork } from "wagmi";

/**
 * A component with a goal card.
 */
export default function GoalCard(props: { goal: GoalEntity; sx?: SxProps }) {
  const { chain } = useNetwork();
  const { data: authorAccounts } = useAccountsFinder({
    chain: chain,
    id: props.goal.authorAddress,
  });
  const { data: authorProfileUriData } = useUriDataLoader<ProfileUriDataEntity>(
    authorAccounts?.[0]?.profileUri
  );

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
        <AccountAvatar
          account={props.goal.authorAddress}
          accountProfileUriData={authorProfileUriData}
        />
      </Box>
      {/* Right part */}
      <Box width={1} ml={1.5} display="flex" flexDirection="column">
        <AccountLink
          account={props.goal.authorAddress}
          accountProfileUriData={authorProfileUriData}
        />
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
            {!props.goal.isClosed ? "🔥" : props.goal.isAchieved ? "✅" : "❌"}{" "}
            Goal #{props.goal.id}
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
            {chainToSupportedChainNativeCurrencySymbol(chain)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.goal.messagesNumber} Messages
          </Typography>
        </Stack>
      </Box>
    </CardBox>
  );
}
