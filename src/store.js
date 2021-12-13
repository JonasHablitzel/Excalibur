import create from "zustand";
import { devtools } from "zustand/middleware";

const useStore = create(
  devtools((set, get) => ({
    referenceMarkers: [
      [100, 100],
      [200, 200],
      [300, 300],
      [400, 400],
    ],
    updatePositionofRefMarkerIdx: (idx, newpos) => {
      const newRefMarkers = Object.assign([], get().referenceMarkers, {
        [idx]: newpos,
      });
      set({
        referenceMarkers: newRefMarkers,
      });
    },
    mapMarkers: [
      [48.81, 8.91],
      [48.82, 8.9],
      [48.83, 8.92],
      [48.84, 8.93],
    ],
    removeOneOfMarkers: () => {
      const mapMarkers = get().mapMarkers;
      const referenceMarkers = get().referenceMarkers;
      const newmapMarkers = [...mapMarkers.slice(0, mapMarkers.length - 1)];
      const newRefMarkers = [
        ...referenceMarkers.slice(0, referenceMarkers.length - 1),
      ];
      set({
        mapMarkers: newmapMarkers,
        referenceMarkers: newRefMarkers,
      });
    },
    addOneToMarkers: () => {
      const mapMarkers = get().mapMarkers;
      const referenceMarkers = get().referenceMarkers;
      const newmapMarkers = [
        ...mapMarkers,
        [mapMarkers.at(-1)[0] + 0.0003, mapMarkers.at(-1)[1] + 0.0003],
      ];
      const newRefMarkers = [
        ...referenceMarkers,
        [referenceMarkers.at(-1)[0] + 50, referenceMarkers.at(-1)[1] + 50],
      ];
      set({ mapMarkers: newmapMarkers, referenceMarkers: newRefMarkers });
    },
    setMapMarkers: (newmarkers) => set({ mapMarkers: newmarkers }),
    updatePositionofMapMarkersIdx: (idx, newpos) => {
      const newRefMarkers = Object.assign([], get().mapMarkers, {
        [idx]: newpos,
      });
      set({
        mapMarkers: newRefMarkers,
      });
    },
    mapImgAlpha: 125,
    setMapImgAlpha: (newalpha) => set({ mapImgAlpha: newalpha }),
    mapRefPoint: [48.841, 8.9],
    mapPixelSize: { width: null, height: null },
    mapRefPoint2LeftTopMeters: [null, null],
    mapPixel2Meters: null,
    mapCenter: [48.84, 8.93],
    mapZoom: 13,
    setMapPixelSize: (width, height) => set({ width: width, height: height }),
    setMapRefPoint: (latlng, topleft) =>
      set({ mapRefPoint: latlng, mapRefPoint2LeftTopMeters: topleft }),
    setMapCenter: (newCenter) => set({ mapCenter: newCenter }),
    setMapZoom: (newZoom) => set({ mapZoom: newZoom }),
    setMapState: (newZoom, newCenter, maprefmeter, mapscale, mappixelsize) => {
      set({
        mapZoom: newZoom,
        mapCenter: newCenter,
        mapPixel2Meters: mapscale,
        mapRefPoint2LeftTopMeters: maprefmeter,
        mapPixelSize: mappixelsize,
      });
    },
    refImg: { url: null, width: null, height: null },
    setNewImage: (newImgUrl, width, height) =>
      set({ refImg: { height: height, width: width, url: newImgUrl } }),
    cameraMatrix: [
      [1477.4049999999999727, 0.0, 934.8596999999999753],
      [0.0, 1505.5460000000000491, 501.929300000000012],
      [0.0, 0.0, 1.0],
    ],
    distortion: [
      0.04348233, -0.05591999, -0.01053048, -0.005402182, -0.01795766,
    ],
  }))
);

export default useStore;
