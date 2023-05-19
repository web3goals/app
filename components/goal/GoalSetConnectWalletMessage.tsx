import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { LargeLoadingButton } from "components/styled";

/**
 * A component with message that user need to connect wallet before setting a goal.
 */
export default function GoalSetConnectWalletMessage() {
  const { openConnectModal } = useConnectModal();

  return (
    <Box width={1} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" textAlign="center" fontWeight={700}>
        🪄 Please connect a wallet
      </Typography>
      <Typography textAlign="center" mt={1}>
        before setting a goal
      </Typography>
      <LargeLoadingButton
        variant="outlined"
        onClick={() => openConnectModal?.()}
        sx={{ mt: 4 }}
      >
        Connect wallet
      </LargeLoadingButton>
    </Box>
  );
}
