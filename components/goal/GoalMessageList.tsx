import { SxProps } from "@mui/material";
import EntityList from "components/entity/EntityList";
import GoalMessageEntity from "entities/subgraph/GoalMessageEntity";
import useGoalMessagesFinder from "hooks/subgraph/useGoalMessagesFinder";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import GoalMessageCard from "./GoalMessageCard";

/**
 * A component with goal messge list.
 */
export default function GoalMessageList(props: {
  id?: string;
  pageSize?: number;
  displayGoalLink?: boolean;
  hideLoadMoreButton?: boolean;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = props.pageSize || 10;
  const { data: pageGoalMessages } = useGoalMessagesFinder({
    chain: chain,
    goal: props.id,
    first: pageSize,
    skip: pageNumber * pageSize,
  });
  const [allGoalMessages, setAllGoalMessages] = useState<
    GoalMessageEntity[] | undefined
  >();

  useEffect(() => {
    if (pageGoalMessages) {
      setAllGoalMessages(
        pageNumber === 0
          ? pageGoalMessages
          : [...(allGoalMessages || []), ...pageGoalMessages]
      );
    }
  }, [pageGoalMessages]);

  return (
    <EntityList
      entities={allGoalMessages}
      renderEntityCard={(goalMessage, index) => (
        <GoalMessageCard
          key={index}
          message={goalMessage}
          displayGoalLink={props.displayGoalLink}
          onUpdate={() => {
            // TODO: Update subgraph data
          }}
        />
      )}
      noEntitiesText="😐 no goal messages"
      displayLoadMoreButton={
        !props.hideLoadMoreButton && pageGoalMessages?.length === pageSize
      }
      isMoreLoading={!pageGoalMessages}
      onLoadMoreButtonClick={() => setPageNumber(pageNumber + 1)}
      sx={{ ...props.sx }}
    />
  );
}
