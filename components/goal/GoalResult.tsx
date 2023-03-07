import { Player } from "@livepeer/react";
import {
  Box,
  Link as MuiLink,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import {
  ThickDivider,
  WidgetBox,
  WidgetTitle,
  WidgetText,
  WidgetSeparatorText,
} from "components/styled";
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
 *
 * TODO: Rename to "GoalProofs"
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
        VERIFICATION_DATA_KEYS.anyProofUri,
        VERIFICATION_DATA_KEYS.anyLivepeerPlaybackId,
      ],
    ],
  });

  if (props.isClosed) {
    return (
      <Box sx={{ width: 1, ...props.sx }}>
        <ThickDivider />
        <WidgetSeparatorText mt={6}>eventually</WidgetSeparatorText>
        {/* Result */}
        <WidgetBox bgcolor={palette.blue} mt={2}>
          <WidgetTitle>Goal is</WidgetTitle>
          <WidgetText>
            {props.isAchieved ? "✅ achieved" : "❌ failed"}
          </WidgetText>
        </WidgetBox>
        {props.isAchieved ? (
          <>
            <WidgetSeparatorText mt={2}>and this is</WidgetSeparatorText>
            {/* Proof */}
            <WidgetBox bgcolor={palette.green} mt={2}>
              <WidgetTitle>Proof</WidgetTitle>
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
                <WidgetText>
                  {/* Any uri */}
                  {goalVerificationData?.[0] && (
                    <MuiLink href={goalVerificationData[0]} target="_blank">
                      {ipfsUriToShortUri(goalVerificationData[0])}
                    </MuiLink>
                  )}
                  {/* Loading */}
                  {!goalVerificationData && <>...</>}
                </WidgetText>
              )}
            </WidgetBox>
          </>
        ) : (
          <>
            <WidgetSeparatorText mt={2}>
              and watchers and application shared
            </WidgetSeparatorText>
            {/* Stake */}
            <WidgetBox bgcolor={palette.red} mt={2}>
              <WidgetTitle>Stake</WidgetTitle>
              <Stack direction="row" spacing={1}>
                <WidgetText>
                  {ethers.utils.formatEther(props.authorStake)}
                </WidgetText>
                <WidgetText>{getChainNativeCurrencySymbol(chain)}</WidgetText>
              </Stack>
            </WidgetBox>
          </>
        )}
      </Box>
    );
  }

  return <></>;
}
