import { SxProps, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import {
  CardBox,
  FullWidthSkeleton,
  ExtraLargeLoadingButton,
} from "components/styled";
import GoalStepEntity from "entities/subgraph/GoalStepEntity";
import useError from "hooks/useError";
import useSubgraph from "hooks/useSubgraph";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import GoalStepCard from "./GoalStepCard";

/**
 * A component with goal step list.
 */
export default function GoalStepList(props: {
  id: string;
  authorAddress: string;
  isClosed: boolean;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const { findGoalSteps } = useSubgraph();
  const [goalSteps, setGoalSteps] = useState<
    Array<GoalStepEntity> | undefined
  >();
  const [isMoreGoalsExist, setIsMoreGoalsExist] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 5;

  async function loadMoreGoalSteps(
    pageNumber: number,
    existingGoalSteps: Array<GoalStepEntity>
  ) {
    try {
      const loadedGoalSteps = await findGoalSteps({
        chain: chain,
        goal: props.id,
        first: pageSize,
        skip: pageNumber * pageSize,
      });
      setGoalSteps([...existingGoalSteps, ...loadedGoalSteps]);
      setIsMoreGoalsExist(loadedGoalSteps.length === pageSize);
      setPageNumber(pageNumber);
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    loadMoreGoalSteps(0, []);
  }, [chain, props]);

  return (
    <Box sx={{ width: 1, ...props.sx }}>
      {/* List with steps */}
      {goalSteps && goalSteps.length > 0 && (
        <Stack spacing={2}>
          {goalSteps.map((goalStep, index) => (
            <GoalStepCard
              key={index}
              authorAddress={props.authorAddress}
              isClosed={props.isClosed}
              step={goalStep}
              onUpdate={() => {
                // TODO: Update subgraph data
              }}
            />
          ))}
          {/* Actions */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            {isMoreGoalsExist && (
              <ExtraLargeLoadingButton
                variant="outlined"
                onClick={() => {
                  loadMoreGoalSteps(pageNumber + 1, goalSteps);
                }}
              >
                Load More
              </ExtraLargeLoadingButton>
            )}
          </Stack>
        </Stack>
      )}
      {/* Empty list */}
      {goalSteps && goalSteps.length === 0 && (
        <CardBox>
          <Typography textAlign="center">😐 no steps</Typography>
        </CardBox>
      )}
      {/* Loading list */}
      {!goalSteps && <FullWidthSkeleton />}
    </Box>
  );
}
