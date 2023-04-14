import {
  Avatar,
  Box,
  Link as MuiLink,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { CardBox } from "components/styled";
import AccountEntity from "entities/subgraph/AccountEntity";
import { emojiAvatarForAddress } from "utils/avatars";
import { addressToShortAddress } from "utils/converters";
import { useAccount } from "wagmi";
import AccountReputation from "./AccountReputation";

/**
 * A component with an account card.
 */
export default function AccountCard(props: {
  account: AccountEntity;
  sx?: SxProps;
}) {
  const { address } = useAccount();

  return (
    <CardBox sx={{ display: "flex", flexDirection: "row", ...props.sx }}>
      {/* Left part */}
      <Box>
        {/* Avatar */}
        <Avatar
          sx={{
            width: 48,
            height: 48,
            borderRadius: 48,
            background: emojiAvatarForAddress(props.account.id).color,
          }}
        >
          <Typography fontSize={20}>
            {emojiAvatarForAddress(props.account.id).emoji}
          </Typography>
        </Avatar>
      </Box>
      {/* Right part */}
      <Box width={1} ml={1.5} display="flex" flexDirection="column">
        {/* Account */}
        <Stack direction="row" spacing={1} alignItems="center">
          <MuiLink
            href={`/accounts/${props.account.id}`}
            fontWeight={700}
            variant="body2"
          >
            {addressToShortAddress(props.account.id)}
          </MuiLink>
          {address?.toLowerCase() === props.account.id.toLowerCase() && (
            <Typography color="text.secondary" fontWeight={700} variant="body2">
              (you)
            </Typography>
          )}
        </Stack>
        {/* Reputation */}
        <AccountReputation
          achievedGoals={props.account.achievedGoals}
          failedGoals={props.account.failedGoals}
          motivatedGoals={props.account.motivatedGoals}
          notMotivatedGoals={props.account.notMotivatedGoals}
          small
          sx={{ mt: 1 }}
        />
      </Box>
    </CardBox>
  );
}
