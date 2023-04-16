import { Box, SxProps, Typography } from "@mui/material";
import { ExtraLargeLoadingButton } from "components/styled";
import GoalStepList from "./GoalStepList";

/**
 * A component to explore goal steps.
 */
export default function GoalStepExplore(props: {
  title?: string;
  subtitle?: string;
  pageSize?: number;
  displayLoadMoreButton?: boolean;
  displayExploreAllButton?: boolean;
  sx?: SxProps;
}) {
  return (
    <Box sx={{ width: 1, ...props.sx }}>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        {props.title || "✨️ Steps"}
      </Typography>
      <Typography color="text.secondary" textAlign="center" mt={1}>
        {props.subtitle || "leading to achievement and success"}
      </Typography>
      <GoalStepList
        pageSize={props.pageSize}
        displayGoalLink
        hideLoadMoreButton={!props.displayLoadMoreButton}
        sx={{ mt: 4 }}
      />
      {props.displayExploreAllButton && (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
          <ExtraLargeLoadingButton variant="outlined" href="/goals/steps">
            Explore All
          </ExtraLargeLoadingButton>
        </Box>
      )}
    </Box>
  );
}
