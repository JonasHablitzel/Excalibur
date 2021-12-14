import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import TabCamera from "./TabCamera";
import TabSetup from "./TabSetup";
import TabMap from "./TabMap";

import shallow from "zustand/shallow";
import useStore from "./store/store";
import useUiState from "./store/uistate";

export default function Controls() {
  const [tabIndex, setTabIndex] = useUiState(
    (state) => [state.tabIndex, state.setTabIndex],
    shallow
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
        minWidth: 500,
        minHeight: 200,
        position: "absolute",
        zIndex: 50,
        top: 8,
        left: 8,
        p: 0,
        m: 0,
        bgcolor: "background.paper",
      }}
    >
      <TabContext value={tabIndex}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            variant="fullWidth"
            onChange={(event, newValue) => {
              setTabIndex(newValue);
            }}
            aria-label="lab API tabs example"
          >
            <Tab label="Setup" value="1" />
            <Tab label="Map" value="2" />
            <Tab label="Camera" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <TabSetup />
        </TabPanel>
        <TabPanel value="2">
          <TabMap />
        </TabPanel>
        <TabPanel value="3">
          <TabCamera />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
