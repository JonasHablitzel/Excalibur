import { useMemo, useRef, useEffect } from "react";
import { Marker, Tooltip, useMap } from "react-leaflet";

export default function DraggableMarker({
  index,
  position,
  setPosition,
  draggable,
  tooltiptext,
  tootipoffset,
  whencreated = null,
  ...other
}) {
  if (!tootipoffset) {
    tootipoffset = [4, 0];
  }

  const markerRef = useRef(null);
  const mapref = useMap();
  useEffect(() => {
    if (whencreated != null && markerRef.current) {
      const marker = markerRef.current;
      whencreated(index, marker, mapref);
    }
  }, []);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(index, marker, mapref);
        }
      },
    }),
    [position]
  );
  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      {...other}
    >
      <Tooltip
        permanent={true}
        offset={tootipoffset}
        className={"leaflet-tooltip-own"}
      >
        {tooltiptext}
      </Tooltip>
    </Marker>
  );
}
