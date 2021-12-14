import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";

import shallow from "zustand/shallow";
import useStore from "./store/store";

export default function TabSetup() {
  const setNewImage = useStore((state) => state.setNewImage);
  const updateSate = useStore((state) => state.updateSate);
  const sceneName = useStore((state) => state.sceneName);
  const setSceneName = useStore((state) => state.setSceneName);
  const storeState = useStore(
    (state) => ({
      referenceMarkers: state.referenceMarkers,
      mapMarkers: state.mapMarkers,
      mapRefPoint: state.mapRefPoint,
      mapCenter: state.mapCenter,
      mapZoom: state.mapZoom,
      cameraMatrix: state.cameraMatrix,
      distorCoeff: state.distorCoeff,
      homgrToRefPoint: state.homgrToRefPoint,
      sceneName: state.sceneName,
    }),
    shallow
  );

  const handleUpload = (e) => {
    if (
      !(
        e.target.files[0].name.endsWith("jpg") ||
        e.target.files[0].name.endsWith("png")
      )
    ) {
      console.log("Wrong Datatype");
      return;
    }

    const localImageUrl = URL.createObjectURL(e.target.files[0]);
    let img = new Image();
    img.onload = function () {
      setNewImage(localImageUrl, img.width, img.height);
    };
    img.src = localImageUrl;
  };

  const handleJsonUpload = (e) => {
    if (!e.target.files[0].name.endsWith("json")) {
      console.log("Wrong Datatype");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (event) {
      const result = JSON.parse(event.target.result);
      const validKeys = Object.keys(storeState);
      Object.keys(result).forEach(
        (key) => validKeys.includes(key) || delete result[key]
      );
      const newState = { ...storeState, ...result };
      updateSate(newState);
    };
    reader.readAsText(event.target.files[0]);
  };
  const handleDownload = () => {
    var link = document.createElement("a");
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(storeState));
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `${storeState.sceneName}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box display="flex" flexDirection="column">
      <TextField
        label="Scene Name"
        value={sceneName}
        onChange={(e) => setSceneName(e.target.value)}
      />
      <Divider sx={{ pt: 3, pb: 2 }} textAlign="left">
        Uploads
      </Divider>
      <Box
        display="flex"
        flexDirection="row"
        width="100%"
        justifyContent="center"
      >
        <label htmlFor="contained-button-file">
          <input
            accept="image/*"
            id="contained-button-file"
            type="file"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
          <Button variant="contained" component="span">
            Upload Scene Image
          </Button>
        </label>
        <label style={{ marginLeft: "30px" }} htmlFor="contained-button-file2">
          <input
            accept="application/json"
            id="contained-button-file2"
            type="file"
            onChange={handleJsonUpload}
            style={{ display: "none" }}
          />
          <Button variant="contained" component="span">
            Upload prev. Result
          </Button>
        </label>
      </Box>
      <Divider sx={{ pt: 3, pb: 2 }} textAlign="left">
        Downloads
      </Divider>
      <Button variant="contained" onClick={handleDownload}>
        Download Results
      </Button>
    </Box>
  );
}
