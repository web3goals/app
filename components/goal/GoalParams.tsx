import { Stack, SxProps, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { WidgetLink, WidgetTypography } from "components/styled";
import WidgetBox from "components/widget/WidgetBox";
import { BigNumber, ethers } from "ethers";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import { useEffect, useState } from "react";
import { addressToShortAddress } from "utils/converters";
import { getContractsChain } from "utils/network";

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
  const { handleError } = useError();
  const { loadJsonFromIpfs } = useIpfs();
  const [uriData, setUriData] = useState<any>();

  useEffect(() => {
    setUriData(undefined);
    loadJsonFromIpfs(props.uri)
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
      <WidgetBox title="On" color="#E97E27" sx={{ mb: 2 }}>
        <WidgetTypography>
          {new Date(
            props.createdTimestamp.toNumber() * 1000
          ).toLocaleDateString()}
        </WidgetTypography>
      </WidgetBox>
      {/* Author address */}
      <WidgetBox title="Account" color="#333333" sx={{ mb: 2 }}>
        <WidgetLink href={`/accounts/${props.authorAddress.toString()}`}>
          🔗 {addressToShortAddress(props.authorAddress.toString())}
        </WidgetLink>
      </WidgetBox>
      {/* Description */}
      <WidgetBox title="Set goal" color="#2B6EFD" sx={{ mb: 2 }}>
        <WidgetTypography>{uriData?.description || "..."}</WidgetTypography>
      </WidgetBox>
      {/* Text divider */}
      <Typography fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
        and
      </Typography>
      {/* Stake */}
      <WidgetBox title="Staked" color="#FF4400" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1}>
          <WidgetTypography>
            {ethers.utils.formatEther(props.authorStake)}
          </WidgetTypography>
          <WidgetTypography>
            {getContractsChain().nativeCurrency?.symbol}
          </WidgetTypography>
        </Stack>
      </WidgetBox>
      {/* Text divider */}
      <Typography fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
        on achieving it
      </Typography>
      {/* Deadline timestamp */}
      <WidgetBox title="On" color="#410C92" sx={{ mb: 2 }}>
        <WidgetTypography>
          {new Date(
            props.deadlineTimestamp.toNumber() * 1000
          ).toLocaleDateString()}
        </WidgetTypography>
      </WidgetBox>
      {/* Text divider */}
      <Typography fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
        otherwise the stake will be shared between watchers and application
      </Typography>
    </Box>
  );
}
