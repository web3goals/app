import { Box, Link as MuiLink, SxProps, Typography } from "@mui/material";
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
          sx={{ background: palette.yellow, borderColor: palette.yellow }}
        >
          <MuiLink
            href=""
            variant="h4"
            fontWeight={700}
            sx={{ color: "white" }}
          >
            {balance?.formatted} {balance?.symbol}
          </MuiLink>
          <Typography variant="body2" color="white" mt={1}>
            🔥 Active
          </Typography>
        </CardBox>
      )}
    </Box>
  );
}
