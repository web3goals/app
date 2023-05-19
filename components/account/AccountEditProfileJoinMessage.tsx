import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { LargeLoadingButton } from "components/styled";
import Link from "next/link";

/**
 * A component with message that user need to join club before create a profile.
 */
export default function AccountEditProfileJoinMessage() {
  return (
    <Box width={1} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" textAlign="center" fontWeight={700}>
        🪄 Profile creation
      </Typography>
      <Typography textAlign="center" mt={1}>
        is currently only available to members of the early adopters club
      </Typography>
      <Link href={`/club`}>
        <LargeLoadingButton variant="outlined" sx={{ mt: 4 }}>
          Learn about club
        </LargeLoadingButton>
      </Link>
    </Box>
  );
}
