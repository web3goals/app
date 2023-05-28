import { SxProps } from "@mui/material";
import { BigNumber } from "ethers";
import { theme } from "theme";
import { palette } from "theme/palette";
import { timestampToDate } from "utils/converters";

/**
 * A component with a goal deadline timestamp and remaining time.
 */
export default function GoalDeadlineText(props: {
  deadlineTimestamp: number | string | BigNumber | undefined;
  showRemainingTime?: boolean;
  sx?: SxProps;
}) {
  const deadlineDate = timestampToDate(props.deadlineTimestamp);

  if (!deadlineDate) {
    return <>Unknown</>;
  }

  const remainingMsecs = deadlineDate.getTime() - new Date().getTime();
  const remainingHours = remainingMsecs / 1000 / 60 / 60;
  const remainingDays = remainingHours / 24;

  return (
    <>
      {deadlineDate.toLocaleDateString()}{" "}
      {props.showRemainingTime && (
        <>
          {remainingHours > 3 * 24 && (
            <span style={{ color: theme.palette.text.secondary }}>
              ({Math.floor(remainingDays)} days)
            </span>
          )}
          {remainingHours <= 3 * 24 && remainingHours > 1 && (
            <span style={{ color: palette.orange }}>
              ({Math.floor(remainingHours)} hours)
            </span>
          )}
        </>
      )}
    </>
  );
}
