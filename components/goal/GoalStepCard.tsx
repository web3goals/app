import { Link as MuiLink, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Stack } from "@mui/system";
import { CardBox, XlLoadingButton } from "components/styled";
import { GOAL_STEPS } from "constants/goalSteps";
import { VERIFICATION_DATA_KEYS } from "constants/verifiers";
import { DialogContext } from "context/dialog";
import GoalStepEntity from "entities/subgraph/GoalStepEntity";
import GoalMessageUriDataEntity from "entities/uri/GoalMessageUriDataEntity";
import GoalMotivatorUriDataEntity from "entities/uri/GoalMotivatorUriDataEntity";
import { BigNumber } from "ethers";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import { useContext, useEffect, useState } from "react";
import { theme } from "theme";
import { palette } from "theme/palette";
import {
  addressToShortAddress,
  bigNumberTimestampToLocaleString,
} from "utils/converters";
import { useAccount } from "wagmi";
import GoalAcceptMotivatorDialog from "./GoalAcceptMotivatorDialog";

/**
 * A component with a goal step card.
 */
export default function GoalStepCard(props: {
  goalStep: GoalStepEntity;
  onUpdate: Function;
}) {
  const { address } = useAccount();

  if (props.goalStep.type === GOAL_STEPS.goalSet) {
    return <GoalStepCardGoalSet goalStep={props.goalStep} />;
  }
  if (props.goalStep.type === GOAL_STEPS.motivatorAdded) {
    return (
      <GoalStepCardMotivatorAdded
        goalStep={props.goalStep}
        onUpdate={props.onUpdate}
      />
    );
  }
  if (props.goalStep.type === GOAL_STEPS.motivatorAccepted) {
    return <GoalStepCardMotivatorAccepted goalStep={props.goalStep} />;
  }
  if (props.goalStep.type === GOAL_STEPS.messagePosted) {
    return <GoalStepCardMessagePosted goalStep={props.goalStep} />;
  }
  if (props.goalStep.type === GOAL_STEPS.verificationDataSet) {
    return <GoalStepCardVerificationDataSet goalStep={props.goalStep} />;
  }
  if (props.goalStep.type === GOAL_STEPS.goalVerifiedAsAchieved) {
    return <GoalStepCardGoalVerifiedAsAchieved goalStep={props.goalStep} />;
  }
  if (props.goalStep.type === GOAL_STEPS.goalVerifiedAsFailed) {
    return <GoalStepCardGoalVerifiedAsFailed goalStep={props.goalStep} />;
  }
  if (props.goalStep.type === GOAL_STEPS.goalClosedAsAchieved) {
    return <GoalStepCardGoalClosedAsAchieved goalStep={props.goalStep} />;
  }
  if (props.goalStep.type === GOAL_STEPS.goalClosedAsFailed) {
    return <GoalStepCardGoalClosedAsFailed goalStep={props.goalStep} />;
  }

  return <GoalStepCardUndefined goalStep={props.goalStep} />;
}

function GoalStepCardUndefined(props: { goalStep: GoalStepEntity }) {
  return (
    <CardBox>
      <GoalStepCardHeader
        goalStep={props.goalStep}
        text="Made undefined step"
      />
    </CardBox>
  );
}

function GoalStepCardGoalSet(props: { goalStep: GoalStepEntity }) {
  return (
    <CardBox sx={{ background: palette.blue, borderColor: palette.blue }}>
      <GoalStepCardHeader
        goalStep={props.goalStep}
        text="Set the goal 🔥"
        isDarkBackground={true}
      />
    </CardBox>
  );
}

function GoalStepCardMotivatorAdded(props: {
  goalStep: GoalStepEntity;
  onUpdate: Function;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { loadJsonFromIpfs } = useIpfs();
  const { handleError } = useError();
  const [motivatorUriData, setMotivatorUriData] = useState<
    GoalMotivatorUriDataEntity | undefined
  >();

  useEffect(() => {
    loadJsonFromIpfs(props.goalStep.extraDataUri)
      .then((result) => setMotivatorUriData(result))
      .catch((error) => handleError(error, true));
  }, []);

  return (
    <CardBox sx={{ borderColor: palette.purpleLight }}>
      <GoalStepCardHeader
        goalStep={props.goalStep}
        text="Sent a motivational message:"
      />
      <Typography mt={1}>{motivatorUriData?.message || "..."}</Typography>
      <XlLoadingButton
        variant="outlined"
        onClick={() =>
          showDialog?.(
            <GoalAcceptMotivatorDialog
              id={props.goalStep.goal.id}
              motivatorAccountAddress={props.goalStep.authorAddress}
              onSuccess={props.onUpdate}
              onClose={closeDialog}
            />
          )
        }
        sx={{ mt: 2 }}
      >
        Accept
      </XlLoadingButton>
    </CardBox>
  );
}

function GoalStepCardMotivatorAccepted(props: { goalStep: GoalStepEntity }) {
  const { address } = useAccount();

  const motivatorAccountAddress = props.goalStep.extraData.split("=")[1];

  return (
    <CardBox
      sx={{ background: palette.purpleLight, borderColor: palette.purpleLight }}
    >
      <GoalStepCardHeader
        goalStep={props.goalStep}
        text="Accepted a motivator:"
        isDarkBackground={true}
      />
      <Stack direction="row" spacing={1} alignItems="center" ml={3} mt={1}>
        <Typography>
          👤{" "}
          <MuiLink
            href={`/accounts/${motivatorAccountAddress}`}
            color={theme.palette.primary.contrastText}
            fontWeight={700}
            variant="body2"
          >
            {addressToShortAddress(motivatorAccountAddress)}
          </MuiLink>
        </Typography>
        {address?.toLowerCase() === motivatorAccountAddress.toLowerCase() && (
          <Typography color={grey[300]} fontWeight={700} variant="body2">
            (you)
          </Typography>
        )}
      </Stack>
    </CardBox>
  );
}

function GoalStepCardMessagePosted(props: { goalStep: GoalStepEntity }) {
  const { loadJsonFromIpfs } = useIpfs();
  const { handleError } = useError();
  const [messageUriData, setMessageUriData] = useState<
    GoalMessageUriDataEntity | undefined
  >();

  useEffect(() => {
    loadJsonFromIpfs(props.goalStep.extraDataUri)
      .then((result) => setMessageUriData(result))
      .catch((error) => handleError(error, true));
  }, []);

  return (
    <CardBox>
      <GoalStepCardHeader goalStep={props.goalStep} />
      <Typography mt={1}>{messageUriData?.message || "..."}</Typography>
    </CardBox>
  );
}

// TODO: Display proof documents from any proof uri
function GoalStepCardVerificationDataSet(props: { goalStep: GoalStepEntity }) {
  const verificationDataKey = props.goalStep.extraData.split("=")[0];

  return (
    <CardBox sx={{ borderColor: palette.blue }}>
      <GoalStepCardHeader goalStep={props.goalStep} text="Updated proofs:" />
      {verificationDataKey === VERIFICATION_DATA_KEYS.anyProofUri && (
        <Typography mt={1}>
          <pre>{JSON.stringify(props.goalStep, null, 2)}</pre>
        </Typography>
      )}
      {verificationDataKey !== VERIFICATION_DATA_KEYS.anyProofUri && (
        <Typography mt={1}>
          There is a problem with the display of proofs, try again later
        </Typography>
      )}
    </CardBox>
  );
}

function GoalStepCardGoalVerifiedAsAchieved(props: {
  goalStep: GoalStepEntity;
}) {
  return (
    <CardBox sx={{ borderColor: palette.green }}>
      <GoalStepCardHeader
        goalStep={props.goalStep}
        text="Verified the goal as achieved 👍"
      />
    </CardBox>
  );
}

function GoalStepCardGoalVerifiedAsFailed(props: { goalStep: GoalStepEntity }) {
  return (
    <CardBox sx={{ borderColor: palette.red }}>
      <GoalStepCardHeader
        goalStep={props.goalStep}
        text="Verified the goal as failed 👎"
      />
    </CardBox>
  );
}

function GoalStepCardGoalClosedAsAchieved(props: { goalStep: GoalStepEntity }) {
  return (
    <CardBox sx={{ background: palette.green, borderColor: palette.green }}>
      <GoalStepCardHeader
        goalStep={props.goalStep}
        text="Closed the goal as achieved 💪"
        isDarkBackground={true}
      />
    </CardBox>
  );
}

function GoalStepCardGoalClosedAsFailed(props: { goalStep: GoalStepEntity }) {
  return (
    <CardBox sx={{ background: palette.red, borderColor: palette.red }}>
      <GoalStepCardHeader
        goalStep={props.goalStep}
        text="Closed the goal as failed 😥"
        isDarkBackground={true}
      />
    </CardBox>
  );
}

function GoalStepCardHeader(props: {
  goalStep: GoalStepEntity;
  text?: string;
  isDarkBackground?: boolean;
}) {
  const { address } = useAccount();

  return (
    <>
      {/* Account */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>
          👤{" "}
          <MuiLink
            href={`/accounts/${props.goalStep.authorAddress}`}
            color={
              props.isDarkBackground
                ? theme.palette.primary.contrastText
                : undefined
            }
            fontWeight={700}
            variant="body2"
          >
            {addressToShortAddress(props.goalStep.authorAddress)}
          </MuiLink>
        </Typography>
        {address?.toLowerCase() ===
          props.goalStep.authorAddress.toLowerCase() && (
          <Typography
            color={props.isDarkBackground ? grey[300] : grey[600]}
            fontWeight={700}
            variant="body2"
          >
            (you)
          </Typography>
        )}
      </Stack>
      {/* Date */}
      <Typography
        color={props.isDarkBackground ? grey[300] : grey[600]}
        variant="body2"
      >
        📅{" "}
        {bigNumberTimestampToLocaleString(
          BigNumber.from(props.goalStep.createdTimestamp)
        )}
      </Typography>
      {/* Text */}
      {props.text && (
        <Typography
          color={
            props.isDarkBackground
              ? theme.palette.primary.contrastText
              : undefined
          }
          fontWeight={700}
          mt={1}
        >
          {props.text}
        </Typography>
      )}
    </>
  );
}
