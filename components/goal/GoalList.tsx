import { SxProps, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import {
  CardBox,
  FullWidthSkeleton,
  XxlLoadingButton,
} from "components/styled";
import GoalEntity from "entities/GoalEntity";
import useError from "hooks/useError";
import useSubgraph from "hooks/useSubgraph";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import GoalCard from "./GoalCard";

/**
 * A component with goal list.
 */
export default function GoalList(props: {
  authorAddress?: string;
  isClosed?: boolean;
  isAchieved?: boolean;
  watcherAddress?: string;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const { findGoals } = useSubgraph();
  const [goals, setGoals] = useState<Array<GoalEntity> | undefined>();
  const [isMoreGoalsExist, setIsMoreGoalsExist] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 3;

  async function loadMoreGoals(pageNumber: number) {
    try {
      const loadedGoals = await findGoals({
        chain: chain,
        authorAddress: props.authorAddress,
        isClosed: props.isClosed,
        isAchieved: props.isAchieved,
        watcherAddress: props.watcherAddress,
        first: pageSize,
        skip: pageNumber * pageSize,
      });
      setGoals(goals ? [...goals, ...loadedGoals] : loadedGoals);
      setPageNumber(pageNumber);
      if (loadedGoals.length === 0) {
        setIsMoreGoalsExist(false);
      }
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    setGoals(undefined);
    setIsMoreGoalsExist(true);
    loadMoreGoals(0);
  }, [chain, props]);

  return (
    <Box sx={{ width: 1, ...props.sx }}>
      {/* List with goals */}
      {goals && goals.length > 0 && (
        <Stack spacing={2}>
          {goals.map((goal, index) => (
            <GoalCard key={index} goal={goal} />
          ))}
          {/* Actions */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            {isMoreGoalsExist && (
              <XxlLoadingButton
                variant="outlined"
                onClick={() => {
                  loadMoreGoals(pageNumber + 1);
                }}
              >
                Load More
              </XxlLoadingButton>
            )}
          </Stack>
        </Stack>
      )}
      {/* Empty list */}
      {goals && goals.length === 0 && (
        <CardBox>
          <Typography textAlign="center">😐 no goals</Typography>
        </CardBox>
      )}
      {/* Loading list */}
      {!goals && <FullWidthSkeleton />}
    </Box>
  );
}
