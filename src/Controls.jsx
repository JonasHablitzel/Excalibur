import { useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Slider from "@mui/material/Slider";
const Input = styled("input")({
  display: "none",
});
import Box from "@mui/material/Box";

import useStore from "./store";

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randLatLng(center) {
  const randVal = randInt(-100, 100) / 100000;
  return [center[0] + randVal, center[1] + randVal];
}

export default function Controls() {
  const setNewImage = useStore((state) => state.setNewImage);
  const mapMarkers = useStore((state) => state.mapMarkers);
  const mapCenter = useStore((state) => state.mapCenter);
  const setMapMarkers = useStore((state) => state.setMapMarkers);
  const setMapImgAlpha = useStore((state) => state.setMapImgAlpha);
  const addOneToMarkers = useStore((state) => state.addOneToMarkers);
  const removeOneOfMarkers = useStore((state) => state.removeOneOfMarkers);

  const handleUpload = (e) => {
    const localImageUrl = URL.createObjectURL(e.target.files[0]);
    let img = new Image();
    img.onload = function () {
      setNewImage(localImageUrl, img.width, img.height);
    };
    img.src = localImageUrl;
  };

  const moveRefPts2View = () => {
    setMapMarkers(mapMarkers.map(() => randLatLng(mapCenter)));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        minWidth: 300,
        minHeight: 200,
        position: "absolute",
        zIndex: 50,
        top: 10,
        left: 10,
        p: 2,
        m: 2,
        bgcolor: "background.paper",
      }}
    >
      {" "}
      <label htmlFor="contained-button-file">
        <Input
          accept="image/*"
          id="contained-button-file"
          type="file"
          onChange={handleUpload}
        />
        <Button variant="contained" component="span">
          Upload Scene Image
        </Button>
      </label>
      <Button variant="contained" component="span" onClick={moveRefPts2View}>
        Move Map Ref Point to View
      </Button>
      <Slider
        min={0}
        max={255}
        defaultValue={50}
        aria-label="Default"
        valueLabelDisplay="auto"
        onChangeCommitted={(e, value) => setMapImgAlpha(value)}
      />
      <ButtonGroup
        disableElevation
        variant="contained"
        aria-label="outlined primary button group"
      >
        <Button onClick={removeOneOfMarkers} disabled={mapMarkers.length == 4}>
          -
        </Button>
        <Button onClick={addOneToMarkers}>+</Button>
      </ButtonGroup>
    </Box>
  );
}
