import { Stack, SxProps, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  WidgetBox,
  WidgetLink,
  WidgetTitle,
  WidgetText,
  WidgetSeparatorText,
} from "components/styled";
import GoalUriDataEntity from "entities/GoalUriDataEntity";
import { BigNumber, ethers } from "ethers";
import useError from "hooks/useError";
import useGoal from "hooks/useGoal";
import { useEffect, useState } from "react";
import { palette } from "theme/palette";
import { getChainNativeCurrencySymbol } from "utils/chains";
import {
  addressToShortAddress,
  bigNumberTimestampToLocaleDateString,
} from "utils/converters";
import { useNetwork } from "wagmi";

/**
 * A component with goal parameters.
 */
export default function GoalParams(props: {
  id: string;
  uri: string;
  createdTimestamp: BigNumber;
  authorAddress: string;
  authorStake: BigNumber;
  deadlineTimestamp: BigNumber;
  isClosed: boolean;
  isAchieved: boolean;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const { loadGoalUriData } = useGoal();
  const [uriData, setUriData] = useState<GoalUriDataEntity | undefined>();

  useEffect(() => {
    setUriData(undefined);
    loadGoalUriData(props.uri)
      .then((data) => setUriData(data))
      .catch((error) => handleError(error, true));
  }, [props.uri]);

  return (
    <Box sx={{ width: 1, ...props.sx }}>
      {/* Id */}
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        sx={{ mb: 3 }}
      >
        {!props.isClosed
          ? "⌛ Active"
          : props.isAchieved
          ? "✅ Achieved"
          : "❌ Failed"}{" "}
        Goal #{props.id}
      </Typography>
      {/* Created timestamp */}
      <WidgetBox bgcolor={palette.orange} mb={2}>
        <WidgetTitle>On</WidgetTitle>
        <WidgetText>
          {bigNumberTimestampToLocaleDateString(props.createdTimestamp)}
        </WidgetText>
      </WidgetBox>
      {/* Author address */}
      <WidgetBox bgcolor={palette.greyDark} mb={2}>
        <WidgetTitle>Account</WidgetTitle>
        <WidgetLink href={`/accounts/${props.authorAddress.toString()}`}>
          🔗 {addressToShortAddress(props.authorAddress.toString())}
        </WidgetLink>
      </WidgetBox>
      {/* Description */}
      <WidgetBox bgcolor={palette.blue} mb={2}>
        <WidgetTitle>Set goal</WidgetTitle>
        <WidgetText>{uriData?.description || "..."}</WidgetText>
      </WidgetBox>
      <WidgetSeparatorText mb={2}>and</WidgetSeparatorText>
      {/* Stake */}
      <WidgetBox bgcolor={palette.red} mb={2}>
        <WidgetTitle>Staked</WidgetTitle>
        <Stack direction="row" spacing={1}>
          <WidgetText>{ethers.utils.formatEther(props.authorStake)}</WidgetText>
          <WidgetText>{getChainNativeCurrencySymbol(chain)}</WidgetText>
        </Stack>
      </WidgetBox>
      <WidgetSeparatorText mb={2}>on achieving it</WidgetSeparatorText>
      {/* Deadline timestamp */}
      <WidgetBox bgcolor={palette.purpleDark} mb={2}>
        <WidgetTitle>By</WidgetTitle>
        <WidgetText>
          {bigNumberTimestampToLocaleDateString(props.deadlineTimestamp)}
        </WidgetText>
      </WidgetBox>
      <WidgetSeparatorText>
        otherwise the stake will be shared between watchers and application
      </WidgetSeparatorText>
    </Box>
  );
}
