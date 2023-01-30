import {
  Box,
  Link as MuiLink,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import GoalEntity from "entities/GoalEntity";
import GoalUriDataEntity from "entities/GoalUriDataEntity";
import { BigNumber, ethers } from "ethers";
import useError from "hooks/useError";
import useGoal from "hooks/useGoal";
import { useEffect, useState } from "react";
import {
  addressToShortAddress,
  bigNumberTimestampToLocaleDateString,
} from "utils/converters";
import { getContractsChain } from "utils/network";

/**
 * A component with a goal card.
 */
export default function GoalCard(props: { goal: GoalEntity; sx?: SxProps }) {
  const { handleError } = useError();
  const { loadGoalUriData } = useGoal();
  const [uriData, setUriData] = useState<GoalUriDataEntity | undefined>();

  useEffect(() => {
    setUriData(undefined);
    loadGoalUriData(props.goal.uri)
      .then((data) => setUriData(data))
      .catch((error) => handleError(error, true));
  }, [props.goal]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        border: "solid",
        borderColor: !props.goal.isClosed
          ? "divider"
          : props.goal.isAchieved
          ? "success.main"
          : "error.main",
        borderWidth: 6,
        borderRadius: 2,
        py: 2,
        px: 4,
        ...props.sx,
      }}
    >
      {/* Link, author */}
      <Stack sx={{ justifyContent: "center" }}>
        <Typography>
          {!props.goal.isClosed ? "⌛" : props.goal.isAchieved ? "✅" : "❌"}{" "}
          <MuiLink href={`/goals/${props.goal.id}`}>
            <strong>#{props.goal.id}</strong>
          </MuiLink>
        </Typography>
        <Typography>
          👤{" "}
          <MuiLink href={`/accounts/${props.goal.authorAddress}`}>
            <strong>{addressToShortAddress(props.goal.authorAddress)}</strong>
          </MuiLink>
        </Typography>
      </Stack>
      {/* Description */}
      <Stack
        sx={{
          flex: 1,
          justifyContent: "center",
          ml: { md: 8 },
          my: { xs: 2, md: 0 },
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {uriData?.description || "..."}
        </Typography>
      </Stack>
      {/* Watchers, stake, deadline */}
      <Stack
        sx={{
          alignItems: { md: "flex-end" },
          justifyContent: "center",
          ml: { md: 6 },
          minWidth: { md: 120 },
        }}
      >
        <Typography fontWeight={700}>{props.goal.watchersNumber} 👥</Typography>
        <Typography fontWeight={700}>
          {ethers.utils.formatEther(BigNumber.from(props.goal.authorStake))}{" "}
          {getContractsChain().nativeCurrency?.symbol}
        </Typography>
        <Typography fontWeight={700}>
          {bigNumberTimestampToLocaleDateString(
            BigNumber.from(props.goal.deadlineTimestamp)
          )}
        </Typography>
      </Stack>
    </Box>
  );
}
