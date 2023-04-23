import { Box, SxProps, Typography } from "@mui/material";
import { CardBox } from "components/styled";
import AccountEntity from "entities/subgraph/AccountEntity";
import ProfileUriDataEntity from "entities/uri/ProfileUriDataEntity";
import useUriDataLoader from "hooks/useUriDataLoader";
import AccountAvatar from "./AccountAvatar";
import AccountLink from "./AccountLink";
import AccountReputation from "./AccountReputation";

/**
 * A component with an account card.
 */
export default function AccountCard(props: {
  account: AccountEntity;
  sx?: SxProps;
}) {
  const { data: accountProfileUriData } =
    useUriDataLoader<ProfileUriDataEntity>(props.account.profileUri);

  return (
    <CardBox sx={{ display: "flex", flexDirection: "row", ...props.sx }}>
      {/* Left part */}
      <Box>
        <AccountAvatar
          account={props.account.id}
          accountProfileUriData={accountProfileUriData}
          size={64}
          emojiSize={28}
        />
      </Box>
      {/* Right part */}
      <Box width={1} ml={1.5} display="flex" flexDirection="column">
        <AccountLink
          account={props.account.id}
          accountProfileUriData={accountProfileUriData}
        />
        {accountProfileUriData?.attributes[1].value && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {accountProfileUriData?.attributes[1].value}
          </Typography>
        )}
        <AccountReputation
          achievedGoals={props.account.achievedGoals}
          failedGoals={props.account.failedGoals}
          motivations={props.account.motivations}
          superMotivations={props.account.superMotivations}
          small
          sx={{ mt: 1 }}
        />
      </Box>
    </CardBox>
  );
}
