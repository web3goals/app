import { SxProps } from "@mui/material";
import EntityList from "components/entity/EntityList";
import GoalEntity from "entities/subgraph/GoalEntity";
import useGoalsFinder from "hooks/subgraph/useGoalsFinder";
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
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = props.pageSize || 10;
  const { data: pageGoals } = useGoalsFinder({
    chain: chain,
    authorAddress: props.authorAddress,
    isClosed: props.isClosed,
    isAchieved: props.isAchieved,
    motivatorAddress: props.motivatorAddress,
    first: pageSize,
    skip: pageNumber * pageSize,
  });
  const [allGoals, setAllGoals] = useState<GoalEntity[] | undefined>();

  useEffect(() => {
    if (pageGoals) {
      setAllGoals(
        pageNumber === 0 ? pageGoals : [...(allGoals || []), ...pageGoals]
      );
    }
  }, [pageGoals]);

  return (
    <EntityList
      entities={allGoals}
      renderEntityCard={(goal, index) => <GoalCard key={index} goal={goal} />}
      noEntitiesText="😐 no goals"
      displayLoadMoreButton={
        !props.hideLoadMoreButton && pageGoals?.length === pageSize
      }
      isMoreLoading={!pageGoals}
      onLoadMoreButtonClick={() => setPageNumber(pageNumber + 1)}
      sx={{ ...props.sx }}
    />
  );
}
