import { Stack, SxProps, Typography, Link as MuiLink } from "@mui/material";
import { Box } from "@mui/system";
import {
  WidgetBox,
  WidgetLink,
  WidgetSeparatorText,
  WidgetText,
  WidgetTitle,
} from "components/styled";
import { BigNumber, ethers } from "ethers";
import Link from "next/link";
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
  createdTimestamp: BigNumber;
  description: string;
  authorAddress: string;
  authorStake: BigNumber;
  deadlineTimestamp: BigNumber;
  isClosed: boolean;
  isAchieved: boolean;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();

  return (
    <Box sx={{ width: 1, ...props.sx }}>
      {/* Id */}
      <Typography variant="h4" fontWeight={700} textAlign="center">
        {!props.isClosed ? "🔥" : props.isAchieved ? "✅" : "❌"} Goal #
        {props.id}
      </Typography>
      <WidgetSeparatorText mt={2}>was set</WidgetSeparatorText>
      {/* Author address */}
      <WidgetBox bgcolor={palette.greyDark} mt={3}>
        <WidgetTitle>By</WidgetTitle>
        <WidgetLink href={`/accounts/${props.authorAddress.toString()}`}>
          {addressToShortAddress(props.authorAddress.toString())}
        </WidgetLink>
      </WidgetBox>
      {/* Created timestamp */}
      <WidgetBox bgcolor={palette.greyLight} mt={2}>
        <WidgetTitle>On</WidgetTitle>
        <WidgetText>
          {bigNumberTimestampToLocaleDateString(props.createdTimestamp)}
        </WidgetText>
      </WidgetBox>
      <WidgetSeparatorText mt={3}>with</WidgetSeparatorText>
      {/* Description */}
      <WidgetBox bgcolor={palette.blue} mt={3}>
        <WidgetTitle>Description</WidgetTitle>
        <WidgetText>{props.description}</WidgetText>
      </WidgetBox>
      <WidgetSeparatorText mt={3}>
        {props.isClosed
          ? "and this goal must have been achieved"
          : "and this goal must be achieved"}
      </WidgetSeparatorText>
      {/* Deadline timestamp */}
      <WidgetBox bgcolor={palette.purpleDark} mt={3}>
        <WidgetTitle>By</WidgetTitle>
        <WidgetText>
          {bigNumberTimestampToLocaleDateString(props.deadlineTimestamp)}
        </WidgetText>
      </WidgetBox>
      <WidgetSeparatorText mt={2}>
        {props.isClosed
          ? props.isAchieved
            ? "and it was achieved, so"
            : "but it was failed, so"
          : "otherwise"}
      </WidgetSeparatorText>
      {/* Stake */}
      <WidgetBox bgcolor={palette.red} mt={2}>
        <WidgetTitle>Stake</WidgetTitle>
        <Stack direction="row" spacing={1}>
          <WidgetText>{ethers.utils.formatEther(props.authorStake)}</WidgetText>
          <WidgetText>{getChainNativeCurrencySymbol(chain)}</WidgetText>
        </Stack>
      </WidgetBox>
      <WidgetSeparatorText mt={3}>
        {props.isClosed ? (
          props.isAchieved ? (
            "was be returned to the author of this goal"
          ) : (
            <>
              will be shared between accepted{" "}
              <Link href="#motivators" legacyBehavior passHref>
                <MuiLink>motivators</MuiLink>
              </Link>{" "}
              and this application
            </>
          )
        ) : (
          <>
            will be shared between accepted{" "}
            <Link href="#motivators" legacyBehavior passHref>
              <MuiLink>motivators</MuiLink>
            </Link>{" "}
            and this application
          </>
        )}
      </WidgetSeparatorText>
    </Box>
  );
}
