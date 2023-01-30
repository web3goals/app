import { Stack, Typography } from "@mui/material";
import GoalCard from "components/goal/GoalCard";
import Layout from "components/layout";
import {
  CentralizedBox,
  FullWidthSkeleton,
  XxlLoadingButton,
} from "components/styled";
import GoalEntity from "entities/GoalEntity";
import useError from "hooks/useError";
import useSubgraph from "hooks/useSubgraph";
import { useEffect, useState } from "react";

/**
 * Page with goals.
 */
export default function Goals() {
  const { handleError } = useError();
  const { findGoals } = useSubgraph();
  const [goals, setGoals] = useState<Array<GoalEntity> | undefined>();
  const [isMoreGoalsExist, setIsMoreGoalsExist] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 3;

  async function loadMoreGoals() {
    try {
      const nextPageNumber = pageNumber + 1;
      const loadedGoals = await findGoals(
        pageSize,
        (nextPageNumber - 1) * pageSize
      );
      setGoals(goals ? [...goals, ...loadedGoals] : loadedGoals);
      setPageNumber(nextPageNumber);
      if (loadedGoals.length === 0) {
        setIsMoreGoalsExist(false);
      }
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    loadMoreGoals();
  }, []);

  return (
    <Layout>
      <CentralizedBox>
        {/* Title */}
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: 4 }}
        >
          🎯 Last goals
        </Typography>
        {/* Goals */}
        {goals ? (
          <Stack spacing={2} sx={{ width: 1 }}>
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
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
                    loadMoreGoals();
                  }}
                >
                  Load More
                </XxlLoadingButton>
              )}
            </Stack>
          </Stack>
        ) : (
          <FullWidthSkeleton />
        )}
      </CentralizedBox>
    </Layout>
  );
}
