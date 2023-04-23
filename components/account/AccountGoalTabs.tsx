import { TabContext, TabList, TabPanel } from "@mui/lab";
import { SxProps, Tab } from "@mui/material";
import { Box } from "@mui/system";
import GoalList from "components/goal/GoalList";
import { useState } from "react";

/**
 * A component with tabs with account goals.
 */
export default function AccountGoalTabs(props: {
  address: string;
  sx?: SxProps;
}) {
  const [tabValue, setTabValue] = useState("1");

  function handleChange(_: any, newTabValue: any) {
    setTabValue(newTabValue);
  }

  return (
    <Box sx={{ width: 1, ...props.sx }}>
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
          <Tab label="Account goals" value="1" />
          <Tab label="Commented goals" value="2" />
        </TabList>
        <TabPanel value="1" sx={{ px: 0 }}>
          <GoalList authorAddress={props.address} />
        </TabPanel>
        <TabPanel value="2" sx={{ px: 0 }}>
          <GoalList motivatorAddress={props.address} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
