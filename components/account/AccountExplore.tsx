import { Box, SxProps, Typography } from "@mui/material";
import { ExtraLargeLoadingButton } from "components/styled";
import AccountList from "./AccountList";

/**
 * A component to explore accounts.
 */
export default function AccountExplore(props: {
  title?: string;
  subtitle?: string;
  sx?: SxProps;
}) {
  return (
    <Box sx={{ width: 1, ...props.sx }}>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        {props.title || "🔆 People"}
      </Typography>
      <Typography color="text.secondary" textAlign="center" mt={1}>
        {props.subtitle || "who fill this space with energy"}
      </Typography>
      <AccountList pageSize={3} hideLoadMoreButton sx={{ mt: 4 }} />
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <ExtraLargeLoadingButton variant="outlined" href="/accounts">
          Explore All
        </ExtraLargeLoadingButton>
      </Box>
    </Box>
  );
}
