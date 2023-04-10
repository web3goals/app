import { SxProps, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import {
  CardBox,
  FullWidthSkeleton,
  XxlLoadingButton,
} from "components/styled";
import GoalEntity from "entities/subgraph/GoalEntity";
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
  motivatorAddress?: string;
  pageSize?: number;
  hideLoadMoreButton?: boolean;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const { findGoals } = useSubgraph();
  const [goals, setGoals] = useState<Array<GoalEntity> | undefined>();
  const [isMoreGoalsExist, setIsMoreGoalsExist] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = props.pageSize || 10;

  async function loadMoreGoals(
    pageNumber: number,
    existingGoals: Array<GoalEntity>
  ) {
    try {
      const loadedGoals = await findGoals({
        chain: chain,
        authorAddress: props.authorAddress,
        isClosed: props.isClosed,
        isAchieved: props.isAchieved,
        motivatorAddress: props.motivatorAddress,
        first: pageSize,
        skip: pageNumber * pageSize,
      });
      setGoals([...existingGoals, ...loadedGoals]);
      setIsMoreGoalsExist(loadedGoals.length === pageSize);
      setPageNumber(pageNumber);
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    loadMoreGoals(0, []);
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
          {!props.hideLoadMoreButton && isMoreGoalsExist && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={4}
            >
              <XxlLoadingButton
                variant="outlined"
                onClick={() => {
                  loadMoreGoals(pageNumber + 1, goals);
                }}
              >
                Load More
              </XxlLoadingButton>
            </Box>
          )}
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
