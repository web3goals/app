import { SxProps, Box, Tooltip, Typography } from "@mui/material";
import { palette } from "theme/palette";

/**
 * A component with account's reputation.
 */
export default function AccountReputation(props: {
  achievedGoals: number;
  failedGoals: number;
  motivations: number;
  superMotivations: number;
  small?: boolean;
  sx?: SxProps;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", ...props.sx }}>
      <Tooltip title="Achieved goals">
        <Typography
          variant={props.small ? "body2" : "body1"}
          fontWeight={700}
          color={palette.green}
          sx={{ mr: 1.5, cursor: "help" }}
        >
          ✅ {props.achievedGoals}
        </Typography>
      </Tooltip>
      <Tooltip title="Failed goals">
        <Typography
          variant={props.small ? "body2" : "body1"}
          fontWeight={700}
          color={palette.red}
          sx={{ mr: 1.5, cursor: "help" }}
        >
          ❌ {props.failedGoals}
        </Typography>
      </Tooltip>
      <Tooltip title="Messages that were evaluated as motivating">
        <Typography
          variant={props.small ? "body2" : "body1"}
          fontWeight={700}
          color={palette.yellow}
          sx={{ mr: 1.5, cursor: "help" }}
        >
          ⭐ {props.motivations}
        </Typography>
      </Tooltip>
      <Tooltip title="Messages that were evaluated as super motivating">
        <Typography
          variant={props.small ? "body2" : "body1"}
          fontWeight={700}
          color={palette.red}
          sx={{ cursor: "help" }}
        >
          🌟 {props.superMotivations}
        </Typography>
      </Tooltip>
    </Box>
  );
}
