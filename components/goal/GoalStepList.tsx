import { SxProps } from "@mui/material";
import EntityList from "components/entity/EntityList";
import GoalStepEntity from "entities/subgraph/GoalStepEntity";
import useGoalStepsFinder from "hooks/subgraph/useGoalStepsFinder";
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
  pageSize?: number;
  hideLoadMoreButton?: boolean;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = props.pageSize || 10;
  const { data: pageGoalSteps } = useGoalStepsFinder({
    chain: chain,
    goal: props.id,
    first: pageSize,
    skip: pageNumber * pageSize,
  });
  const [allGoalSteps, setAllGoalSteps] = useState<
    GoalStepEntity[] | undefined
  >();

  useEffect(() => {
    if (pageGoalSteps) {
      setAllGoalSteps(
        pageNumber === 0
          ? pageGoalSteps
          : [...(allGoalSteps || []), ...pageGoalSteps]
      );
    }
  }, [pageGoalSteps]);

  return (
    <EntityList
      entities={allGoalSteps}
      renderEntityCard={(goalStep, index) => (
        <GoalStepCard
          key={index}
          goalAuthorAddress={props.authorAddress}
          isGoalClosed={props.isClosed}
          step={goalStep}
          onUpdate={() => {
            // TODO: Update subgraph data
          }}
        />
      )}
      noEntitiesText="😐 no goal steps"
      displayLoadMoreButton={
        !props.hideLoadMoreButton && pageGoalSteps?.length === pageSize
      }
      isMoreLoading={!pageGoalSteps}
      onLoadMoreButtonClick={() => setPageNumber(pageNumber + 1)}
      sx={{ ...props.sx }}
    />
  );
}
