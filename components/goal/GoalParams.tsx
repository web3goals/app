import { Stack, SxProps, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { WidgetLink, WidgetTypography } from "components/styled";
import WidgetBox from "components/widget/WidgetBox";
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
      <WidgetBox title="On" color={palette.orange} sx={{ mb: 2 }}>
        <WidgetTypography>
          {bigNumberTimestampToLocaleDateString(props.createdTimestamp)}
        </WidgetTypography>
      </WidgetBox>
      {/* Author address */}
      <WidgetBox title="Account" color={palette.greyDark} sx={{ mb: 2 }}>
        <WidgetLink href={`/accounts/${props.authorAddress.toString()}`}>
          🔗 {addressToShortAddress(props.authorAddress.toString())}
        </WidgetLink>
      </WidgetBox>
      {/* Description */}
      <WidgetBox title="Set goal" color={palette.blue} sx={{ mb: 2 }}>
        <WidgetTypography>{uriData?.description || "..."}</WidgetTypography>
      </WidgetBox>
      {/* Text divider */}
      <Typography fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
        and
      </Typography>
      {/* Stake */}
      <WidgetBox title="Staked" color={palette.red} sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1}>
          <WidgetTypography>
            {ethers.utils.formatEther(props.authorStake)}
          </WidgetTypography>
          <WidgetTypography>
            {getChainNativeCurrencySymbol(chain)}
          </WidgetTypography>
        </Stack>
      </WidgetBox>
      {/* Text divider */}
      <Typography fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
        on achieving it
      </Typography>
      {/* Deadline timestamp */}
      <WidgetBox title="By" color={palette.purpleDark} sx={{ mb: 2 }}>
        <WidgetTypography>
          {bigNumberTimestampToLocaleDateString(props.deadlineTimestamp)}
        </WidgetTypography>
      </WidgetBox>
      {/* Text divider */}
      <Typography fontWeight={700} textAlign="center">
        otherwise the stake will be shared between watchers and application
      </Typography>
    </Box>
  );
}
