import { Stack, SxProps, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  WidgetBox,
  WidgetLink,
  WidgetSeparatorText,
  WidgetText,
  WidgetTitle,
  XlLoadingButton,
} from "components/styled";
import { DialogContext } from "context/dialog";
import { BigNumber, ethers } from "ethers";
import { useContext } from "react";
import { palette } from "theme/palette";
import { getChainNativeCurrencySymbol } from "utils/chains";
import {
  addressToShortAddress,
  bigNumberTimestampToLocaleDateString,
} from "utils/converters";
import { useNetwork } from "wagmi";
import GoalShareDialog from "./GoalShareDialog";
import GoalStakeSharingTooltip from "./GoalStakeSharingTooltip";

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
  const { showDialog, closeDialog } = useContext(DialogContext);

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
            <>was returned to the author of this goal</>
          ) : (
            <>
              was{" "}
              <GoalStakeSharingTooltip>
                <Typography
                  component="span"
                  color="primary.main"
                  fontWeight={700}
                  sx={{ cursor: "help" }}
                >
                  shared
                </Typography>
              </GoalStakeSharingTooltip>{" "}
              between accepted motivators and this application
            </>
          )
        ) : (
          <>
            will be{" "}
            <GoalStakeSharingTooltip>
              <Typography
                component="span"
                color="primary.main"
                fontWeight={700}
                sx={{ cursor: "help" }}
              >
                shared
              </Typography>
            </GoalStakeSharingTooltip>{" "}
            between accepted motivators and this application
          </>
        )}
      </WidgetSeparatorText>
      {/* Share button */}
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <XlLoadingButton
          variant="outlined"
          onClick={() =>
            showDialog?.(
              <GoalShareDialog id={props.id} onClose={closeDialog} />
            )
          }
        >
          Share
        </XlLoadingButton>
      </Box>
    </Box>
  );
}
