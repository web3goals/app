import { Box, Stack, SxProps, Typography } from "@mui/material";
import { FullWidthSkeleton } from "components/styled";
import GoalWatcherCard from "./GoalWatcherCard";

/**
 * A component with goal watcher list.
 */
export default function GoalWatcherList(props: {
  watchers: readonly any[] | undefined;
  sx?: SxProps;
}) {
  return (
    <Box sx={{ width: 1, ...props.sx }}>
      {/* List with watchers */}
      {props.watchers && props.watchers.length > 0 && (
        <Stack spacing={2}>
          {props.watchers.map((watcher, index) => (
            <GoalWatcherCard
              key={index}
              accountAddress={watcher.accountAddress}
              addedTimestamp={watcher.addedTimestamp}
              extraDataURI={watcher.extraDataURI}
            />
          ))}
        </Stack>
      )}
      {/* Empty list */}
      {props.watchers && props.watchers.length === 0 && (
        <Typography textAlign="center">no watchers</Typography>
      )}
      {/* Loading list */}
      {!props.watchers && <FullWidthSkeleton />}
    </Box>
  );
}
