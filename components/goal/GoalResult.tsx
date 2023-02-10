import {
  Box,
  Link as MuiLink,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { ThickDivider, WidgetTypography } from "components/styled";
import WidgetBox from "components/widget/WidgetBox";
import { BigNumber, ethers } from "ethers";
import { palette } from "theme/palette";
import { getChainNativeCurrencySymbol } from "utils/chains";
import { ipfsUriToShortUri } from "utils/converters";
import { useNetwork } from "wagmi";

/**
 * A component with goal result.
 */
export default function GoalResult(props: {
  id: string;
  authorStake: BigNumber;
  isClosed: boolean;
  isAchieved: boolean;
  proofUri: string;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();

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
              <WidgetTypography>
                <MuiLink href={props.proofUri} target="_blank">
                  🔗 {ipfsUriToShortUri(props.proofUri)}
                </MuiLink>
              </WidgetTypography>
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
