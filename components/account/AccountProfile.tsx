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
import { profileContractAbi } from "contracts/abi/profileContract";
import AccountEntity from "entities/subgraph/AccountEntity";
import ProfileUriDataEntity from "entities/uri/ProfileUriDataEntity";
import { ethers } from "ethers";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import useSubgraph from "hooks/useSubgraph";
import Link from "next/link";
import { useEffect, useState } from "react";
import { palette } from "theme/palette";
import { emojiAvatarForAddress } from "utils/avatars";
import { chainToSupportedChainProfileContractAddress } from "utils/chains";
import { addressToShortAddress, ipfsUriToHttpUri } from "utils/converters";
import { useAccount, useContractRead, useNetwork } from "wagmi";

/**
 * A component with account profile.
 */
export default function AccountProfile(props: { address: string }) {
  const { handleError } = useError();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { loadJsonFromIpfs } = useIpfs();
  const { findAccounts } = useSubgraph();
  const [profileData, setProfileData] = useState<
    ProfileUriDataEntity | null | undefined
  >();
  const [accountData, setAccountData] = useState<AccountEntity | undefined>();

  // Contract states
  const { status, error, data } = useContractRead({
    address: chainToSupportedChainProfileContractAddress(chain),
    abi: profileContractAbi,
    functionName: "getURI",
    args: [ethers.utils.getAddress(props.address)],
  });

  /**
   * Load profile data from ipfs when contract reading is successed.
   */
  useEffect(() => {
    if (status === "success") {
      if (data) {
        loadJsonFromIpfs(data)
          .then((result) => setProfileData(result))
          .catch((error) => handleError(error, true));
      } else {
        setProfileData(null);
      }
    }
    if (status === "error" && error) {
      setProfileData(null);
    }
  }, [status, error, data]);

  /**
   * Load account data from subgraph.
   */
  useEffect(() => {
    setAccountData(undefined);
    findAccounts({ chain: chain, id: props.address })
      .then((result) =>
        setAccountData(result.length > 0 ? result[0] : undefined)
      )
      .catch((error) => handleError(error, true));
  }, [props.address]);

  if (profileData !== undefined) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        {/* Image */}
        <Box sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 164,
              height: 164,
              borderRadius: 164,
              background: emojiAvatarForAddress(props.address).color,
            }}
            src={
              profileData?.image
                ? ipfsUriToHttpUri(profileData.image)
                : undefined
            }
          >
            <Typography fontSize={64}>
              {emojiAvatarForAddress(props.address).emoji}
            </Typography>
          </Avatar>
        </Box>
        {/* Name */}
        {profileData?.attributes?.[0]?.value && (
          <Typography variant="h4" fontWeight={700} textAlign="center">
            {profileData.attributes[0].value}
          </Typography>
        )}
        {/* About */}
        {profileData?.attributes?.[1]?.value && (
          <Typography textAlign="center" sx={{ maxWidth: 480, mt: 1 }}>
            {profileData.attributes[1].value}
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
            {profileData?.attributes?.[2]?.value && (
              <IconButton
                href={`mailto:${profileData.attributes[2].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <AlternateEmail />
              </IconButton>
            )}
            {profileData?.attributes?.[3]?.value && (
              <IconButton
                href={profileData.attributes[3].value}
                target="_blank"
                component="a"
                color="primary"
              >
                <Language />
              </IconButton>
            )}
            {profileData?.attributes?.[4]?.value && (
              <IconButton
                href={`https://twitter.com/${profileData.attributes[4].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Twitter />
              </IconButton>
            )}
            {profileData?.attributes?.[5]?.value && (
              <IconButton
                href={`https://t.me/${profileData.attributes[5].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Telegram />
              </IconButton>
            )}
            {profileData?.attributes?.[6]?.value && (
              <IconButton
                href={`https://instagram.com/${profileData.attributes[6].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Instagram />
              </IconButton>
            )}
            {(profileData?.attributes?.[2]?.value ||
              profileData?.attributes?.[3]?.value ||
              profileData?.attributes?.[4]?.value ||
              profileData?.attributes?.[5]?.value ||
              profileData?.attributes?.[6]?.value) && (
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
          {/* Address, goal counters */}
          <Stack
            direction="row"
            alignItems="center"
            sx={{ mb: { xs: 1, md: 0 } }}
          >
            <Typography fontWeight={700} sx={{ mr: 1.5 }}>
              {addressToShortAddress(props.address)}
            </Typography>
            {accountData && (
              <>
                <Tooltip title="Achieved goals">
                  <Typography
                    fontWeight={700}
                    color={palette.green}
                    sx={{ mr: 1.5, cursor: "help" }}
                  >
                    ✅ {accountData.achievedGoals}
                  </Typography>
                </Tooltip>
                <Tooltip title="Failed goals">
                  <Typography
                    fontWeight={700}
                    color={palette.red}
                    sx={{ mr: 1.5, cursor: "help" }}
                  >
                    ❌ {accountData.failedGoals}
                  </Typography>
                </Tooltip>
                <Tooltip title="Goals motivated by the account">
                  <Typography
                    fontWeight={700}
                    color={palette.yellow}
                    sx={{ mr: 1.5, cursor: "help" }}
                  >
                    ✨ {accountData.motivatedGoals}
                  </Typography>
                </Tooltip>
                <Tooltip title="Goals motivated by the account unsuccessfully">
                  <Typography
                    fontWeight={700}
                    color={palette.red}
                    sx={{ cursor: "help" }}
                  >
                    💔 {accountData.notMotivatedGoals}
                  </Typography>
                </Tooltip>
              </>
            )}
          </Stack>
        </Stack>
        {/* Owner buttons */}
        {address === props.address && (
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {/* Edit button */}
            <Link href="/accounts/edit" legacyBehavior>
              <LargeLoadingButton variant="contained">
                {profileData ? "Edit Profile" : "Create Profile"}
              </LargeLoadingButton>
            </Link>
          </Stack>
        )}
      </Box>
    );
  }

  return <FullWidthSkeleton />;
}
