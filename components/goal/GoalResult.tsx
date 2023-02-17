import { Player } from "@livepeer/react";
import {
  Box,
  Link as MuiLink,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { ThickDivider, WidgetTypography } from "components/styled";
import WidgetBox from "components/widget/WidgetBox";
import { VERIFICATION_DATA_KEYS } from "constants/verifiers";
import { goalContractAbi } from "contracts/abi/goalContract";
import { BigNumber, ethers } from "ethers";
import { palette } from "theme/palette";
import {
  getChainNativeCurrencySymbol,
  getGoalContractAddress,
} from "utils/chains";
import { ipfsUriToShortUri } from "utils/converters";
import { useContractRead, useNetwork } from "wagmi";

/**
 * A component with goal result.
 */
export default function GoalResult(props: {
  id: string;
  authorStake: BigNumber;
  isClosed: boolean;
  isAchieved: boolean;
  verificationRequirement: string;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();

  // State of contract reading to get goal verification data
  const { data: goalVerificationData } = useContractRead({
    address: getGoalContractAddress(chain),
    abi: goalContractAbi,
    functionName: "getVerificationDataList",
    args: [
      BigNumber.from(props.id),
      [
        VERIFICATION_DATA_KEYS.anyUri,
        VERIFICATION_DATA_KEYS.anyLivepeerPlaybackId,
        VERIFICATION_DATA_KEYS.gitHubUsername,
      ],
    ],
  });

  if (props.isClosed) {
    return (
      <Box sx={{ width: 1, ...props.sx }}>
        <ThickDivider />
        {/* Text */}
        <Typography fontWeight={700} textAlign="center" sx={{ mt: 6 }}>
          eventually
        </Typography>
        {/* Result */}
        <WidgetBox title="Goal is" color={palette.blue} sx={{ mt: 2 }}>
          <WidgetTypography>
            {props.isAchieved ? "✅ achieved" : "❌ failed"}
          </WidgetTypography>
        </WidgetBox>
        {props.isAchieved ? (
          <>
            {/* Text */}
            <Typography fontWeight={700} textAlign="center" sx={{ mt: 2 }}>
              and this is
            </Typography>
            {/* Proof */}
            <WidgetBox title="Proof" color={palette.green} sx={{ mt: 2 }}>
              {/* Any livepeer playback id */}
              {goalVerificationData?.[1] ? (
                <Box
                  sx={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    padding: 1,
                  }}
                >
                  <Player playbackId={goalVerificationData?.[1]} />
                </Box>
              ) : (
                <WidgetTypography>
                  {/* Any uri */}
                  {goalVerificationData?.[0] && (
                    <MuiLink href={goalVerificationData[0]} target="_blank">
                      🔗 {ipfsUriToShortUri(goalVerificationData[0])}
                    </MuiLink>
                  )}
                  {/* Github username */}
                  {goalVerificationData?.[2] && (
                    <MuiLink
                      href={`https://github.com/${goalVerificationData[2]}`}
                      target="_blank"
                    >
                      🔗 {ipfsUriToShortUri(goalVerificationData[2])}
                    </MuiLink>
                  )}
                  {/* Loading */}
                  {!goalVerificationData && <>...</>}
                </WidgetTypography>
              )}
            </WidgetBox>
          </>
        ) : (
          <>
            {/* Text */}
            <Typography fontWeight={700} textAlign="center" sx={{ mt: 2 }}>
              and watchers and application shared
            </Typography>
            {/* Stake */}
            <WidgetBox title="Stake" color={palette.red} sx={{ mt: 2 }}>
              <Stack direction="row" spacing={1}>
                <WidgetTypography>
                  {ethers.utils.formatEther(props.authorStake)}
                </WidgetTypography>
                <WidgetTypography>
                  {getChainNativeCurrencySymbol(chain)}
                </WidgetTypography>
              </Stack>
            </WidgetBox>
          </>
        )}
      </Box>
    );
  }

  return <></>;
}
