import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import { CRS, LatLngBounds } from "leaflet";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";

import DraggableMarker from "./DraggableMarker";
import useStore from "./store";
import gcircle from "./gcircle.png";

const style = {
  display: "flex",
  alignItems: "stretch",
  flexDirection: "column",
  justifyContent: "flex-start",
  border: "solid 1px #ddd",
  background: "#DDDDDD",
  zIndex: 40,
};

const circlesize = 40;

const greenCircle = L.icon({
  iconUrl: gcircle,
  iconSize: [circlesize, circlesize], // size of the icon
  iconAnchor: [circlesize / 2, circlesize / 2], // point of the icon which will correspond to marker's location
  popupAnchor: [circlesize / 2, circlesize / 2], // point from which the popup should open relative to the iconAnchor
});

const FittedImageOverlay = ({ imgUrl, imgHeight, imgWidth }) => {
  const bounds = new LatLngBounds([0, 0], [imgHeight, imgWidth]);
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds);
  }, []);
  return <ImageOverlay url={imgUrl} bounds={bounds} zIndex={10} />;
};

const disableMapInteractions = (map) => {
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  map.dragging.disable();
};

export default function RefImgMap() {
  const bgImg = useStore((state) => state.refImg);
  const refmarkers = useStore((state) => state.referenceMarkers);
  const setRefPosition = useStore(
    (state) => state.updatePositionofRefMarkerIdx
  );

  const mapRef = useRef(null);
  const fitMap = () => {
    if (mapRef.current) {
      const bounds = new LatLngBounds([0, 0], [bgImg.height, bgImg.width]);
      mapRef.current.invalidateSize();
      mapRef.current.fitBounds(bounds);
      console.log("hallo");
    }
  };

  const markerSetPosCallback = (index, marker, mapref) => {
    const xy = marker.getLatLng();
    setRefPosition(index, [xy.lat, xy.lng]);
  };

  return (
    <Rnd
      style={style}
      default={{
        x: 300,
        y: 300,
        width: 320,
        height: 200,
      }}
      dragHandleClassName="rnd-handle"
      bounds=".DragRestrictor "
    >
      <Box
        p={0}
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          height: "30px",
        }}
      >
        <MoreHorizIcon
          className="rnd-handle"
          sx={{ bgcolor: "background.paper", flexGrow: 3 }}
        />
        <IconButton
          aria-label="add to shopping cart"
          size="small"
          onClick={fitMap}
        >
          <AspectRatioIcon />
        </IconButton>
      </Box>
      <MapContainer
        id="mapRefImage"
        center={[10, 10]}
        zoom={1}
        zoomControl={false}
        crs={CRS.Simple}
        minZoom={-6}
        whenCreated={(map) => (mapRef.current = map)}
      >
        {bgImg.url && (
          <FittedImageOverlay
            imgUrl={bgImg.url}
            imgHeight={bgImg.height}
            imgWidth={bgImg.width}
          />
        )}
        {refmarkers.map((latlng, index) => (
          <DraggableMarker
            key={index}
            index={index}
            position={latlng}
            draggable={true}
            setPosition={markerSetPosCallback}
            icon={greenCircle}
            tooltiptext={index + 1}
            tootipoffset={[8, -19]}
          />
        ))}
      </MapContainer>
    </Rnd>
  );
}
