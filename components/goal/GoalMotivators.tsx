import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, SxProps, Tab, Typography } from "@mui/material";
import { WidgetSeparatorText, XlLoadingButton } from "components/styled";
import { DialogContext } from "context/dialog";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import GoalBecomeMotivatorDialog from "./GoalBecomeMotivatorDialog";
import GoalMotivatorList from "./GoalMotivatorList";

/**
 * A component with goal motivators.
 *
 * TODO: Delete component
 */
export default function GoalMotivators(props: {
  id: string;
  authorAddress: string;
  isClosed: boolean;
  motivators: readonly any[];
  onUpdate?: Function;
  sx?: SxProps;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { address } = useAccount();
  const [tabValue, setTabValue] = useState("1");
  const [motivatorsAccepted, setMotivatorsAccepted] = useState<
    any[] | undefined
  >();
  const [motivatorsPending, setMotivatorsPending] = useState<
    any[] | undefined
  >();

  function handleChange(_: any, newTabValue: any) {
    setTabValue(newTabValue);
  }

  useEffect(() => {
    const motivatorsPending = [];
    const motivatorsAccepted = [];
    for (let motivator of props.motivators) {
      if (motivator.isAccepted) {
        motivatorsAccepted.push(motivator);
      } else {
        motivatorsPending.push(motivator);
      }
    }
    setMotivatorsPending(motivatorsPending);
    setMotivatorsAccepted(motivatorsAccepted);
  }, [props.motivators]);

  return (
    <Box
      sx={{
        width: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...props.sx,
      }}
    >
      {/* Title */}
      <Typography
        id="motivators"
        variant="h4"
        fontWeight={700}
        textAlign="center"
      >
        ✨ Motivators
      </Typography>
      <WidgetSeparatorText mt={2}>
        people who motivate to achieve the goal
      </WidgetSeparatorText>
      {/* Button to become a motivator */}
      {!props.isClosed && address !== props.authorAddress && (
        <XlLoadingButton
          variant="contained"
          onClick={() =>
            showDialog?.(
              <GoalBecomeMotivatorDialog
                id={props.id}
                onSuccess={props.onUpdate}
                onClose={closeDialog}
              />
            )
          }
          sx={{ mt: 4 }}
        >
          Become Motivator
        </XlLoadingButton>
      )}
      {/* Tabs */}
      <Box sx={{ width: 1, mt: 4 }}>
        <TabContext value={tabValue}>
          <TabList
            centered
            onChange={handleChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              mb: 1,
            }}
          >
            <Tab label="Accepted" value="1" />
            <Tab label="Pending" value="2" />
          </TabList>
          <TabPanel value="1" sx={{ px: 0 }}>
            <GoalMotivatorList
              id={props.id}
              authorAddress={props.authorAddress}
              motivators={motivatorsAccepted}
              onUpdate={props.onUpdate}
            />
          </TabPanel>
          <TabPanel value="2" sx={{ px: 0 }}>
            <GoalMotivatorList
              id={props.id}
              authorAddress={props.authorAddress}
              motivators={motivatorsPending}
              onUpdate={props.onUpdate}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
}
