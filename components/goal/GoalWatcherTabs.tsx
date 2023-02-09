import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, SxProps, Tab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import GoalWatcherList from "./GoalWatcherList";

/**
 * A component with tabs with goal watchers.
 */
export default function GoalWatcherTabs(props: {
  id: string;
  authorAddress: string;
  watchers: readonly any[];
  sx?: SxProps;
}) {
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
    <Box sx={{ width: 1, ...props.sx }}>
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        sx={{ mb: 2 }}
      >
        👀 Watchers
      </Typography>
      <TabContext value={tabValue}>
        <TabList
          centered
          onChange={handleChange}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mt: 2,
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
          />
        </TabPanel>
        <TabPanel value="2" sx={{ px: 0 }}>
          <GoalWatcherList
            id={props.id}
            authorAddress={props.authorAddress}
            watchers={watchersPending}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
