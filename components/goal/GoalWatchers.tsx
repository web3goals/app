import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, SxProps, Tab, Typography } from "@mui/material";
import { WidgetSeparatorText, XlLoadingButton } from "components/styled";
import { DialogContext } from "context/dialog";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import GoalWatchDialog from "./GoalWatchDialog";
import GoalWatcherList from "./GoalWatcherList";

/**
 * A component with goal watchers.
 */
export default function GoalWatchers(props: {
  id: string;
  authorAddress: string;
  isClosed: boolean;
  watchers: readonly any[];
  onUpdate?: Function;
  sx?: SxProps;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { address } = useAccount();
  const [tabValue, setTabValue] = useState("1");
  const [watchersAccepted, setWatchersAccepted] = useState<any[] | undefined>();
  const [watchersPending, setWatchersPending] = useState<any[] | undefined>();

  function handleChange(_: any, newTabValue: any) {
    setTabValue(newTabValue);
  }

  useEffect(() => {
    const watchersPending = [];
    const watchersAccepted = [];
    for (let watcher of props.watchers) {
      if (watcher.isAccepted) {
        watchersAccepted.push(watcher);
      } else {
        watchersPending.push(watcher);
      }
    }
    setWatchersPending(watchersPending);
    setWatchersAccepted(watchersAccepted);
  }, [props.watchers]);

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
        id="watchers"
        variant="h4"
        fontWeight={700}
        textAlign="center"
      >
        👀 Watchers
      </Typography>
      <WidgetSeparatorText mt={2}>
        people who motivate to achieve the goal
      </WidgetSeparatorText>
      {/* Button to become a watcher */}
      {!props.isClosed && address !== props.authorAddress && (
        <XlLoadingButton
          variant="contained"
          onClick={() =>
            showDialog?.(
              <GoalWatchDialog
                id={props.id}
                onSuccess={props.onUpdate}
                onClose={closeDialog}
              />
            )
          }
          sx={{ mt: 4 }}
        >
          Watch
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
            <GoalWatcherList
              id={props.id}
              authorAddress={props.authorAddress}
              watchers={watchersAccepted}
              onUpdate={props.onUpdate}
            />
          </TabPanel>
          <TabPanel value="2" sx={{ px: 0 }}>
            <GoalWatcherList
              id={props.id}
              authorAddress={props.authorAddress}
              watchers={watchersPending}
              onUpdate={props.onUpdate}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
}
