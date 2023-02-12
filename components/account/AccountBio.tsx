import {
  AlternateEmail,
  Instagram,
  Person,
  Telegram,
  Twitter,
} from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { FullWidthSkeleton, XlLoadingButton } from "components/styled";
import { DialogContext } from "context/dialog";
import { bioContractAbi } from "contracts/abi/bioContract";
import AccountEntity from "entities/AccountEntity";
import { ethers } from "ethers";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import useSubgraph from "hooks/useSubgraph";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { palette } from "theme/palette";
import {
  getBioContractAddress,
  getEpnsChannelAddress,
  getEpnsCommContractAddress,
} from "utils/chains";
import { addressToShortAddress } from "utils/converters";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import AccountNotificationsDialog from "./AccountNotificationsDialog";

/**
 * A component with account bio.
 */
export default function AccountBio(props: { address: string }) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { handleError } = useError();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { loadJsonFromIpfs, ipfsUriToHttpUri } = useIpfs();
  const { findAccounts } = useSubgraph();
  const [bioData, setBioData] = useState<any>();
  const [accountData, setAccountData] = useState<AccountEntity | undefined>();

  // Contract states
  const { status, error, data } = useContractRead({
    address: getBioContractAddress(chain),
    abi: bioContractAbi,
    functionName: "getURI",
    args: [ethers.utils.getAddress(props.address)],
  });

  /**
   * Load bio data from ipfs when contract reading is successed.
   */
  useEffect(() => {
    if (status === "success") {
      if (data) {
        loadJsonFromIpfs(data)
          .then((result) => setBioData(result))
          .catch((error) => handleError(error, true));
      } else {
        setBioData({});
      }
    }
    if (status === "error" && error) {
      setBioData({});
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

  if (bioData) {
    return (
      <>
        {/* Bio image */}
        <Box sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 164,
              height: 164,
              borderRadius: 164,
            }}
            src={bioData.image ? ipfsUriToHttpUri(bioData.image) : undefined}
          >
            <Person sx={{ fontSize: 64 }} />
          </Avatar>
        </Box>
        {/* Bio name */}
        {bioData?.name && (
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 0.5 }}
          >
            {bioData.name}
          </Typography>
        )}
        {/* Bio about */}
        {bioData?.about && (
          <Typography textAlign="center" sx={{ maxWidth: 480, mb: 1.5 }}>
            {bioData.about}
          </Typography>
        )}
        {/* Bio links and other data */}
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          alignItems="center"
        >
          {/* Email and social links */}
          <Stack direction="row" alignItems="center">
            {bioData.email && (
              <IconButton
                href={`mailto:${bioData.email}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <AlternateEmail />
              </IconButton>
            )}
            {bioData.twitter && (
              <IconButton
                href={`https://twitter.com/${bioData.twitter}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Twitter />
              </IconButton>
            )}
            {bioData.telegram && (
              <IconButton
                href={`https://t.me/${bioData.telegram}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Telegram />
              </IconButton>
            )}
            {bioData.instagram && (
              <IconButton
                href={`https://instagram.com/${bioData.instagram}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Instagram />
              </IconButton>
            )}
            {(bioData.twitter || bioData.telegram || bioData.instagram) && (
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
                <Typography
                  fontWeight={700}
                  color={palette.green}
                  sx={{ mr: 1.5 }}
                >
                  ✅ {accountData.achievedGoals}
                </Typography>
                <Typography
                  fontWeight={700}
                  color={palette.red}
                  sx={{ mr: 1.5 }}
                >
                  ❌ {accountData.failedGoals}
                </Typography>
                <Typography fontWeight={700} color={palette.orange}>
                  🧡 {accountData.motivatedGoals}
                </Typography>
              </>
            )}
          </Stack>
        </Stack>
        {/* Owner buttons */}
        {address === props.address && (
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {/* Edit bio button */}
            <Link href="/accounts/edit" legacyBehavior>
              <XlLoadingButton variant="contained">Edit</XlLoadingButton>
            </Link>
            {/* Notifications button */}
            {getEpnsCommContractAddress(chain) &&
              getEpnsChannelAddress(chain) && (
                <XlLoadingButton
                  variant="outlined"
                  onClick={() =>
                    showDialog?.(
                      <AccountNotificationsDialog
                        address={props.address}
                        onClose={closeDialog}
                      />
                    )
                  }
                >
                  Notifications
                </XlLoadingButton>
              )}
          </Stack>
        )}
      </>
    );
  }

  return <FullWidthSkeleton />;
}
