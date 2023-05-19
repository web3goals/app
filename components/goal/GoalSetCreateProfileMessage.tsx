import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { LargeLoadingButton } from "components/styled";
import Link from "next/link";
import { useAccount } from "wagmi";

/**
 * A component with message that user need to create a profile before setting a goal.
 */
export default function GoalSetCreateProfileMessage() {
  const { address } = useAccount();

  return (
    <Box width={1} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" textAlign="center" fontWeight={700}>
        🪄 Please create a profile
      </Typography>
      <Typography textAlign="center" mt={1}>
        on your account page before setting a goal
      </Typography>
      <Link href={`/accounts/${address}`}>
        <LargeLoadingButton variant="outlined" sx={{ mt: 4 }}>
          Open account page
        </LargeLoadingButton>
      </Link>
    </Box>
  );
}
