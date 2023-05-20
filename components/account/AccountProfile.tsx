import {
  AlternateEmail,
  Instagram,
  Language,
  Telegram,
  Twitter,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { FullWidthSkeleton, LargeLoadingButton } from "components/styled";
import { PROFILE_CONTRACT_ROLE_ADOPTER } from "constants/profile";
import { profileContractAbi } from "contracts/abi/profileContract";
import ProfileUriDataEntity from "entities/uri/ProfileUriDataEntity";
import { ethers } from "ethers";
import useAccountsFinder from "hooks/subgraph/useAccountsFinder";
import useUriDataLoader from "hooks/useUriDataLoader";
import Link from "next/link";
import { palette } from "theme/palette";
import { isAddressesEqual } from "utils/addresses";
import { chainToSupportedChainProfileContractAddress } from "utils/chains";
import { addressToShortAddress, stringToAddress } from "utils/converters";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import AccountAvatar from "./AccountAvatar";
import AccountReputation from "./AccountReputation";

/**
 * A component with account profile.
 */
export default function AccountProfile(props: { address: string }) {
  const { chain } = useNetwork();
  const { address } = useAccount();

  /**
   * Define role
   */
  const { data: isHasRole } = useContractRead({
    address: chainToSupportedChainProfileContractAddress(chain),
    abi: profileContractAbi,
    functionName: "hasRole",
    args: [
      PROFILE_CONTRACT_ROLE_ADOPTER,
      stringToAddress(address) || ethers.constants.AddressZero,
    ],
  });

  /**
   * Define profile uri
   */
  const { data: profileUri } = useContractRead({
    address: chainToSupportedChainProfileContractAddress(chain),
    abi: profileContractAbi,
    functionName: "getURI",
    args: [stringToAddress(props.address) || ethers.constants.AddressZero],
  });
  const { data: profileUriData } =
    useUriDataLoader<ProfileUriDataEntity>(profileUri);

  /**
   * Define account entities
   */
  const { data: accounts } = useAccountsFinder({
    chain: chain,
    id: props.address,
  });

  if (profileUri === "" || profileUriData) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        {/* Image */}
        <AccountAvatar
          account={props.address}
          accountProfileUriData={profileUriData}
          size={164}
          emojiSize={64}
          sx={{ mb: 3 }}
        />
        {/* Name and badge */}
        <Stack direction="row" spacing={2} alignItems="center">
          {profileUriData?.attributes?.[0]?.value && (
            <Typography variant="h4" fontWeight={700} textAlign="center">
              {profileUriData.attributes[0].value}
            </Typography>
          )}
          {isHasRole && (
            <Link href="/club" legacyBehavior>
              <Tooltip title="Member of Early Adopters Club">
                <Avatar
                  sx={{
                    cursor: "pointer",
                    width: 36,
                    height: 36,
                    background: palette.orange,
                  }}
                >
                  <Typography fontSize={18}>🧑‍🚀</Typography>
                </Avatar>
              </Tooltip>
            </Link>
          )}
        </Stack>
        {/* About */}
        {profileUriData?.attributes?.[1]?.value && (
          <Typography textAlign="center" sx={{ maxWidth: 480, mt: 1 }}>
            {profileUriData.attributes[1].value}
          </Typography>
        )}
        {/* Links and other data */}
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          alignItems="center"
          mt={1.5}
        >
          {/* Email and links */}
          <Stack direction="row" alignItems="center">
            {profileUriData?.attributes?.[2]?.value && (
              <IconButton
                href={`mailto:${profileUriData.attributes[2].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <AlternateEmail />
              </IconButton>
            )}
            {profileUriData?.attributes?.[3]?.value && (
              <IconButton
                href={profileUriData.attributes[3].value}
                target="_blank"
                component="a"
                color="primary"
              >
                <Language />
              </IconButton>
            )}
            {profileUriData?.attributes?.[4]?.value && (
              <IconButton
                href={`https://twitter.com/${profileUriData.attributes[4].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Twitter />
              </IconButton>
            )}
            {profileUriData?.attributes?.[5]?.value && (
              <IconButton
                href={`https://t.me/${profileUriData.attributes[5].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Telegram />
              </IconButton>
            )}
            {profileUriData?.attributes?.[6]?.value && (
              <IconButton
                href={`https://instagram.com/${profileUriData.attributes[6].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Instagram />
              </IconButton>
            )}
            {(profileUriData?.attributes?.[2]?.value ||
              profileUriData?.attributes?.[3]?.value ||
              profileUriData?.attributes?.[4]?.value ||
              profileUriData?.attributes?.[5]?.value ||
              profileUriData?.attributes?.[6]?.value) && (
              <Divider
                flexItem
                orientation="vertical"
                variant="middle"
                sx={{
                  display: { xs: "none", md: "block" },
                  borderRightWidth: 4,
                  ml: 1.3,
                  mr: 2,
                }}
              />
            )}
          </Stack>
          {/* Address, reputation */}
          <Stack
            direction="row"
            alignItems="center"
            sx={{ mb: { xs: 1, md: 0 } }}
          >
            <Typography fontWeight={700} sx={{ mr: 1.5 }}>
              {addressToShortAddress(props.address)}
            </Typography>
            {accounts?.length === 1 && (
              <AccountReputation
                achievedGoals={accounts[0].achievedGoals}
                failedGoals={accounts[0].failedGoals}
                motivations={accounts[0].motivations}
                superMotivations={accounts[0].superMotivations}
              />
            )}
          </Stack>
        </Stack>
        {/* Owner buttons */}
        {isAddressesEqual(address, props.address) && (
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {/* Edit button */}
            <Link href="/accounts/edit" legacyBehavior>
              <LargeLoadingButton variant="contained">
                {profileUriData ? "Edit Profile" : "Create Profile"}
              </LargeLoadingButton>
            </Link>
          </Stack>
        )}
      </Box>
    );
  }

  return <FullWidthSkeleton />;
}
