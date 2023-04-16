import { Box, SxProps, Typography } from "@mui/material";
import { ExtraLargeLoadingButton } from "components/styled";
import GoalList from "./GoalList";

/**
 * A component to explore goals.
 */
export default function GoalExplore(props: {
  title?: string;
  subtitle?: string;
  sx?: SxProps;
}) {
  return (
    <Box sx={{ width: 1, ...props.sx }}>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        {props.title || "💎 Goals"}
      </Typography>
      <Typography color="text.secondary" textAlign="center" mt={1}>
        {props.subtitle || "that inspire us and everyone around us"}
      </Typography>
      <GoalList pageSize={3} hideLoadMoreButton sx={{ mt: 4 }} />
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <ExtraLargeLoadingButton variant="outlined" href="/goals">
          Explore All
        </ExtraLargeLoadingButton>
      </Box>
    </Box>
  );
}
