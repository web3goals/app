import { Box, Stack, SxProps, Typography } from "@mui/material";
import { CardBox, FullWidthSkeleton } from "components/styled";
import GoalMotivatorCard from "./GoalMotivatorCard";

/**
 * A component with goal motivator list.
 */
export default function GoalMotivatorList(props: {
  id: string;
  authorAddress: string;
  motivators: readonly any[] | undefined;
  onUpdate?: Function;
  sx?: SxProps;
}) {
  return (
    <Box sx={{ width: 1, ...props.sx }}>
      {/* List with motivators */}
      {props.motivators && props.motivators.length > 0 && (
        <Stack spacing={2}>
          {props.motivators.map((motivator, index) => (
            <GoalMotivatorCard
              key={index}
              id={props.id}
              authorAddress={props.authorAddress}
              accountAddress={motivator.accountAddress}
              addedTimestamp={motivator.addedTimestamp}
              extraDataURI={motivator.extraDataURI}
              isAccepted={motivator.isAccepted}
              onUpdate={props.onUpdate}
            />
          ))}
        </Stack>
      )}
      {/* Empty list */}
      {props.motivators && props.motivators.length === 0 && (
        <CardBox>
          <Typography textAlign="center">😐 no motivators</Typography>
        </CardBox>
      )}
      {/* Loading list */}
      {!props.motivators && <FullWidthSkeleton />}
    </Box>
  );
}
