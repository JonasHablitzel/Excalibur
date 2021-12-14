import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  useMapEvents,
  LayersControl,
} from "react-leaflet";
import { BingLayer } from "react-leaflet-bing-v2";
const { BaseLayer } = LayersControl;
import shallow from "zustand/shallow";

import DraggableMarker from "./DraggableMarker";
import useStore from "./store/store";
import { projectexy } from "./utils/geohelpers";

import gcircle from "./gcircle.png";
const circlesize = 40;
const greenCircle = L.icon({
  iconUrl: gcircle,
  iconSize: [circlesize, circlesize], // size of the icon
  iconAnchor: [circlesize / 2, circlesize / 2], // point of the icon which will correspond to marker's location
  popupAnchor: [circlesize / 2, circlesize / 2], // point from which the popup should open relative to the iconAnchor
});

const MapStateProvider = () => {
  const setMapState = useStore((state) => state.setMapState);
  const mapRefPoint = useStore((state) => state.mapRefPoint);
  const setNewMapstate = (mapzoom, mapcenterlatlon, mapbounds, mapsize) => {
    console.log(mapsize);
    const { x: xPixels, y: yPixels } = mapsize;
    const mapcenter = [mapcenterlatlon.lat, mapcenterlatlon.lng];
    const xMeters = mapbounds
      .getSouthWest()
      .distanceTo(mapbounds.getSouthEast()); // west -- east

    const yMeters = mapbounds
      .getNorthEast()
      .distanceTo(mapbounds.getSouthEast()); // north -- south

    const xPixel2Meters = xPixels / xMeters;
    const yPixel2Meters = yPixels / yMeters;
    const mapPixel2Meters = (xPixel2Meters + yPixel2Meters) / 2;
    const mapRefPoint2LeftTopMeters = projectexy(
      mapbounds.getNorthWest(),
      mapRefPoint
    );
    setMapState(
      mapzoom,
      mapcenter,
      mapRefPoint2LeftTopMeters,
      mapPixel2Meters,
      { width: mapsize.x, height: mapsize.y }
    );
  };

  const map = useMapEvents({
    moveend: () => {
      setNewMapstate(
        map.getZoom(),
        map.getCenter(),
        map.getBounds(),
        map.getSize()
      );
    },
    zoomend: () => {
      setNewMapstate(
        map.getZoom(),
        map.getCenter(),
        map.getBounds(),
        map.getSize()
      );
    },
  });

  useEffect(() => {
    setNewMapstate(
      map.getZoom(),
      map.getCenter(),
      map.getBounds(),
      map.getSize()
    );
  }, []);

  return null;
};

export default function Map() {
  const mapMarkers = useStore((state) => state.mapMarkers);
  const mapRefPoint = useStore((state) => state.mapRefPoint);
  const setMapRefPointxy = useStore((state) => state.setMapRefPointxy);
  const setMapPixelSize = useStore((state) => state.setMapPixelSize);
  const setRefPosition = useStore(
    (state) => state.updatePositionofMapMarkersIdx
  );
  const updateMarkers = (index, markerRef, mapref) => {
    const latlng = markerRef.getLatLng();
    setRefPosition(index, [latlng.lat, latlng.lng]);
  };

  const updateMapRefPoint = (index, markerRef, mapref) => {
    const latlng = markerRef.getLatLng();
    const mapRefPoint2LeftTopMeters = projectexy(
      mapref.getBounds().getNorthWest(),
      latlng
    );
    setMapRefPointxy([latlng.lat, latlng.lng], mapRefPoint2LeftTopMeters);
  };

  const [mapCenter, mapZoom] = useStore(
    (state) => [state.mapCenter, state.mapZoom],
    shallow
  );
  const bing_key =
    "AkOOq71QaQ9YVoz-hEDSkAsLhppyWw4QbS1dOwotCGp-ZdEyylxom6ZNCkJSHSop";
  return (
    <MapContainer
      id="map"
      center={mapCenter}
      zoom={mapZoom}
      zoomControl={false}
      whencreated={(map) => setMapPixelSize(map.getSize().x, map.getSize().y)}
    >
      <LayersControl position="topright">
        <BaseLayer name="OpenStreetMap.Mapnik">
          <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        </BaseLayer>
        <BaseLayer checked name="Bing Maps Roads">
          <BingLayer bingkey={bing_key} type="Road" />
        </BaseLayer>
        <BaseLayer checked name="Bing Maps Satelite">
          <BingLayer maxNativeZoom={19} maxZoom={24} bingkey={bing_key} />
        </BaseLayer>
      </LayersControl>
      {mapMarkers.map((latlng, index) => (
        <DraggableMarker
          key={index}
          index={index}
          position={latlng}
          draggable={true}
          setPosition={updateMarkers}
          popupstate={true}
          tooltiptext={index + 1}
          icon={greenCircle}
          tootipoffset={[8, -19]}
        />
      ))}{" "}
      <MapStateProvider />
      <ZoomControl position="bottomleft" />
      <DraggableMarker
        key={"Mapref"}
        position={mapRefPoint}
        setPosition={updateMapRefPoint}
        draggable={true}
        tooltiptext={"Referenc Pos"}
        whencreated={updateMapRefPoint}
      />
    </MapContainer>
  );
}
