import { Link as MuiLink, Stack, SxProps, Typography } from "@mui/material";
import { Box } from "@mui/system";
import AccountAvatar from "components/account/AccountAvatar";
import AccountLink from "components/account/AccountLink";
import {
  CenterBoldText,
  LargeLoadingButton,
  WidgetBox,
  WidgetContentBox,
  WidgetText,
  WidgetTitle,
} from "components/styled";
import { DialogContext } from "context/dialog";
import ProfileUriDataEntity from "entities/uri/ProfileUriDataEntity";
import { BigNumber, ethers } from "ethers";
import useAccountsFinder from "hooks/subgraph/useAccountsFinder";
import useUriDataLoader from "hooks/useUriDataLoader";
import Link from "next/link";
import { useContext } from "react";
import { palette } from "theme/palette";
import { chainToSupportedChainNativeCurrencySymbol } from "utils/chains";
import { bigNumberTimestampToLocaleDateString } from "utils/converters";
import { useNetwork } from "wagmi";
import GoalShareDialog from "./dialog/GoalShareDialog";

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
  const { data: authorAccounts } = useAccountsFinder({
    chain: chain,
    id: props.authorAddress,
  });
  const { data: authorProfileUriData } = useUriDataLoader<ProfileUriDataEntity>(
    authorAccounts?.[0]?.profileUri
  );

  return (
    <Box sx={{ width: 1, ...props.sx }}>
      {/* Id */}
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        color={!props.isClosed ? "yellow" : props.isAchieved ? "green" : "red"}
      >
        {!props.isClosed ? "🔥" : props.isAchieved ? "✅" : "❌"} Goal #
        {props.id}
      </Typography>
      <CenterBoldText mt={1}>was set</CenterBoldText>
      {/* Author address */}
      <WidgetBox bgcolor={palette.greyDark} mt={2}>
        <WidgetTitle>By</WidgetTitle>
        <WidgetContentBox
          display="flex"
          flexDirection="column"
          alignItems={{ xs: "center", md: "flex-start" }}
        >
          <AccountAvatar
            account={props.authorAddress}
            accountProfileUriData={authorProfileUriData}
          />
          <AccountLink
            account={props.authorAddress}
            accountProfileUriData={authorProfileUriData}
            sx={{ mt: 1 }}
          />
        </WidgetContentBox>
      </WidgetBox>
      {/* Created timestamp */}
      <WidgetBox bgcolor={palette.greyLight} mt={2}>
        <WidgetTitle>On</WidgetTitle>
        <WidgetText>
          {bigNumberTimestampToLocaleDateString(props.createdTimestamp)}
        </WidgetText>
      </WidgetBox>
      <CenterBoldText mt={2}>with</CenterBoldText>
      {/* Description */}
      <WidgetBox bgcolor={palette.blue} mt={2}>
        <WidgetTitle>Description</WidgetTitle>
        <WidgetText>{props.description}</WidgetText>
      </WidgetBox>
      <CenterBoldText mt={2}>
        {props.isClosed
          ? "and this goal must have been achieved and closed"
          : "and this goal must be achieved and closed"}
      </CenterBoldText>
      {/* Deadline timestamp */}
      <WidgetBox bgcolor={palette.purpleDark} mt={2}>
        <WidgetTitle>By</WidgetTitle>
        <WidgetText>
          {bigNumberTimestampToLocaleDateString(props.deadlineTimestamp)}
        </WidgetText>
      </WidgetBox>
      <CenterBoldText mt={2}>
        {props.isClosed
          ? props.isAchieved
            ? "and it was achieved, so"
            : "but it was failed, so"
          : "otherwise"}
      </CenterBoldText>
      {/* Stake */}
      <WidgetBox bgcolor={palette.red} mt={2}>
        <WidgetTitle>Stake</WidgetTitle>
        <Stack direction="row" spacing={1}>
          <WidgetText>{ethers.utils.formatEther(props.authorStake)}</WidgetText>
          <WidgetText>
            {chainToSupportedChainNativeCurrencySymbol(chain)}
          </WidgetText>
        </Stack>
      </WidgetBox>
      <CenterBoldText mt={2}>
        {props.isClosed ? (
          props.isAchieved ? (
            <>was be returned to the author of this goal</>
          ) : (
            <>
              was be{" "}
              <Link href={"/#faq-how-stake-is-shared"} passHref legacyBehavior>
                <MuiLink>shared</MuiLink>
              </Link>{" "}
              between motivators and this application
            </>
          )
        ) : (
          <>
            will be{" "}
            <Link href={"/#faq-how-stake-is-shared"} passHref legacyBehavior>
              <MuiLink>shared</MuiLink>
            </Link>{" "}
            between motivators and this application
          </>
        )}
      </CenterBoldText>
      {/* Share button */}
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <LargeLoadingButton
          variant="outlined"
          onClick={() =>
            showDialog?.(
              <GoalShareDialog id={props.id} onClose={closeDialog} />
            )
          }
        >
          Share
        </LargeLoadingButton>
      </Box>
    </Box>
  );
}
