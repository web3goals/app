import { Box, SxProps, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { CardBox, FullWidthSkeleton } from "components/styled";
import { palette } from "theme/palette";
import {
  chainToSupportedChainId,
  chainToSupportedChainTreasuryContractAddress,
} from "utils/chains";
import { useBalance, useNetwork } from "wagmi";

/**
 * A component to explore treasury.
 */
export default function TreasuryExplore(props: {
  title?: string;
  subtitle?: string;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: chainToSupportedChainTreasuryContractAddress(chain),
    chainId: chainToSupportedChainId(chain),
  });

  return (
    <Box sx={{ width: 1, ...props.sx }}>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        {props.title || "🏦 Treasury"}
      </Typography>
      <Typography color="text.secondary" textAlign="center" mt={1}>
        {props.subtitle ||
          "replenished by failed goals and donations, which will be used regularly by the space to reward achievers and motivators with a good reputation"}
      </Typography>
      {isBalanceLoading ? (
        <FullWidthSkeleton sx={{ mt: 4 }} />
      ) : (
        <CardBox
          mt={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{
            background: palette.blue,
            borderColor: palette.blue,
          }}
        >
          <Typography variant="h4" fontWeight={700} color="white">
            {balance?.formatted} {balance?.symbol}
          </Typography>
          <Typography color={grey[300]} mt={0.5}>
            balance for today
          </Typography>
        </CardBox>
      )}
    </Box>
  );
}
