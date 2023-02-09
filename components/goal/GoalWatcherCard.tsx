import { Link as MuiLink, Stack, SxProps, Typography } from "@mui/material";
import GoalWatcherUriDataEntity from "entities/GoalWatcherUriDataEntity";
import { BigNumber } from "ethers";
import useError from "hooks/useError";
import useGoal from "hooks/useGoal";
import { useEffect, useState } from "react";
import {
  addressToShortAddress,
  bigNumberTimestampToLocaleDateString,
} from "utils/converters";

/**
 * A component with a goal watcher card.
 */
export default function GoalWatcherCard(props: {
  accountAddress: string;
  addedTimestamp: BigNumber;
  extraDataURI: string;
  sx?: SxProps;
}) {
  const { handleError } = useError();
  const { loadGoalWatcherUriData } = useGoal();
  const [uriData, setUriData] = useState<
    GoalWatcherUriDataEntity | undefined
  >();

  useEffect(() => {
    setUriData(undefined);
    loadGoalWatcherUriData(props.extraDataURI)
      .then((data) => setUriData(data))
      .catch((error) => handleError(error, true));
  }, [props.extraDataURI]);

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{
        border: "solid",
        borderColor: "divider",
        borderWidth: 6,
        borderRadius: 2,
        py: 2,
        px: 4,
        ...props.sx,
      }}
    >
      {/* Message */}
      <Typography variant="h6" fontWeight={700}>
        {uriData?.message || "..."}
      </Typography>
      {/* Account */}
      <Typography>
        👤{" "}
        <MuiLink href={`/accounts/${props.accountAddress}`} fontWeight={700}>
          {addressToShortAddress(props.accountAddress)}
        </MuiLink>
      </Typography>
      {/* Date */}
      <Typography>
        📅 {bigNumberTimestampToLocaleDateString(props.addedTimestamp)}
      </Typography>
    </Stack>
  );
}
