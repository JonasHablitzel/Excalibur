import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import ButtonGroup from "@mui/material/ButtonGroup";

import useStore from "./store/store";

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randLatLng(center) {
  const randVal = randInt(-100, 100) / 300000;
  return [center[0] + randVal, center[1] + randVal];
}
const rounded = (number) => Math.round(number * 100) / 100;

export default function TabMap() {
  const setMapImgAlpha = useStore((state) => state.setMapImgAlpha);
  const addOneToMarkers = useStore((state) => state.addOneToMarkers);
  const removeOneOfMarkers = useStore((state) => state.removeOneOfMarkers);

  const mapRefPoint = useStore((state) => state.mapRefPoint);
  const mapMarkers = useStore((state) => state.mapMarkers);
  const mapCenter = useStore((state) => state.mapCenter);
  const setMapMarkers = useStore((state) => state.setMapMarkers);
  const setMapRefPoint = useStore((state) => state.setMapRefPoint);

  const moveRefPts2View = () => {
    setMapMarkers(mapMarkers.map(() => randLatLng(mapCenter)));
    setMapRefPoint(randLatLng(mapCenter));
  };
  console.log(rounded(3));
  return (
    <Box display="flex" gap={1} flexDirection="column">
      <Button variant="contained" component="span" onClick={moveRefPts2View}>
        Move All Points to View
      </Button>
      <Divider sx={{ pt: 2 }} textAlign="left">
        Number Points for Calibration
      </Divider>
      <Box display="flex" gap={2} align="center" alignItems="center">
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            onClick={removeOneOfMarkers}
            disabled={mapMarkers.length == 4}
          >
            -
          </Button>
          <Button onClick={addOneToMarkers}>+</Button>
        </ButtonGroup>
        <div>{mapMarkers.length}</div>
      </Box>

      <Divider sx={{ pt: 2 }} textAlign="left">
        Position Reference Point
      </Divider>
      <Box display="flex" gap={2}>
        <TextField
          value={mapRefPoint[0].toFixed(16)}
          id="outlined-basic"
          label="Latitude"
          style={{ width: 200 }}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*.[0-9]*" }}
          onChange={(e) =>
            setMapRefPoint([parseFloat(e.target.value), mapRefPoint[1]])
          }
        />
        <TextField
          value={mapRefPoint[1].toFixed(16)}
          id="outlined-basic"
          label="Longitude"
          style={{ width: 200 }}
          onChange={(e) =>
            setMapRefPoint([mapRefPoint[0], parseFloat(e.target.value)])
          }
        />
      </Box>
      <Divider sx={{ pt: 2 }} textAlign="left">
        Overlay Transparency
      </Divider>
      <Slider
        min={0}
        max={255}
        defaultValue={50}
        aria-label="Default"
        valueLabelDisplay="auto"
        onChangeCommitted={(e, value) => setMapImgAlpha(value)}
      />
    </Box>
  );
}
