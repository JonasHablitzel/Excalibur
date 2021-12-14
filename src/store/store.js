import create from "zustand";
import { devtools } from "zustand/middleware";

const useStore = create(
  devtools((set, get) => ({
    sceneName: "",
    referenceMarkers: [
      [100, 100],
      [200, 200],
      [300, 300],
      [400, 400],
    ],
    mapMarkers: [
      [48.8143842, 8.910335509],
      [48.81424289, 8.910086065],
      [48.81450253, 8.910045831],
      [48.81445307, 8.910367697],
    ],
    mapImgAlpha: 125,
    updatePositionofRefMarkerIdx: (idx, newpos) => {
      const newRefMarkers = Object.assign([], get().referenceMarkers, {
        [idx]: newpos,
      });
      set({
        referenceMarkers: newRefMarkers,
      });
    },
    mapRefPoint: [48.814693, 8.909793],
    mapPixelSize: { width: null, height: null },
    mapRefPoint2LeftTopMeters: [null, null],
    mapPixel2Meters: null,
    mapCenter: [48.84, 8.93],
    mapZoom: 13,
    distorCoeff: [
      0.04348233, -0.05591999, -0.01053048, -0.005402182, -0.01795766,
    ],
    cameraMatrix: [
      [1477.4049999999999727, 0.0, 934.8596999999999753],
      [0.0, 1505.5460000000000491, 501.929300000000012],
      [0.0, 0.0, 1.0],
    ],
    homgrToRefPoint: [
      [0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0],
    ],
    refImg: { url: null, width: null, height: null },
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
        [mapMarkers.at(-1)[0] + 0.00005, mapMarkers.at(-1)[1] + 0.00005],
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
    setMapImgAlpha: (newalpha) => set({ mapImgAlpha: newalpha }),
    setMapPixelSize: (width, height) => set({ width: width, height: height }),
    setMapRefPoint: (latlng) => set({ mapRefPoint: latlng }),
    setMapRefPointxy: (latlng, topleft) =>
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

    setNewImage: (newImgUrl, width, height) =>
      set({ refImg: { height: height, width: width, url: newImgUrl } }),

    setCamMatrix: (newMatrix) => set({ cameraMatrix: newMatrix }),
    setDistorCoeff: (newval) => set({ distorCoeff: newval }),
    setHomgrToRefPoint: (newMatrix) => set({ homgrToRefPoint: newMatrix }),
    setSceneName: (newval) => set({ sceneName: newval }),
    updateSate: ({
      referenceMarkers,
      mapMarkers,
      mapRefPoint,
      mapCenter,
      mapZoom,
      cameraMatrix,
      distorCoeff,
      homgrToRefPoint,
      sceneName,
    }) =>
      set({
        referenceMarkers: referenceMarkers,
        mapMarkers: mapMarkers,
        mapRefPoint: mapRefPoint,
        mapCenter: mapCenter,
        mapZoom: mapZoom,
        cameraMatrix: cameraMatrix,
        distorCoeff: distorCoeff,
        homgrToRefPoint: homgrToRefPoint,
        sceneName: sceneName,
      }),
  }))
);

export default useStore;
