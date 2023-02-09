import { Box, Stack, SxProps, Typography } from "@mui/material";
import { FullWidthSkeleton } from "components/styled";
import GoalWatcherCard from "./GoalWatcherCard";

/**
 * A component with goal watcher list.
 */
export default function GoalWatcherList(props: {
  id: string;
  authorAddress: string;
  watchers: readonly any[] | undefined;
  onUpdate?: Function;
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
              id={props.id}
              authorAddress={props.authorAddress}
              accountAddress={watcher.accountAddress}
              addedTimestamp={watcher.addedTimestamp}
              extraDataURI={watcher.extraDataURI}
              isAccepted={watcher.isAccepted}
              onUpdate={props.onUpdate}
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
