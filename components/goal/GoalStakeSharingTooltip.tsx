import { Tooltip } from "@mui/material";

/**
 * Tooltop with information about goal stake sharing.
 */
export default function GoalStakeSharingTooltip(props: { children: any }) {
  return (
    <Tooltip
      title={
        <span>
          If there are no motivators, the app will get all the stake that will
          be used to improve the space.
          <br />
          <br />
          Otherwise, the stake will be shared between the app and motivators
          accepted by the goal's author.
        </span>
      }
    >
      {props.children}
    </Tooltip>
  );
}
