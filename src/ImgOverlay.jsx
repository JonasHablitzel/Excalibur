import React, { useRef, useEffect, useState } from "react";
import useStore from "./store";
import { homographyfromepnp, image2cvMat, jsarray2cvMat } from "./cvhelpers";
import { projectexy } from "./geohelpers";
import shallow from "zustand/shallow";
export default function ImgOverlay({ props }) {
  const outCanvas = useRef(null);
  const refImg = useStore((state) => state.refImg);
  const mapMarkers = useStore((state) => state.mapMarkers);
  const mapImgAlpha = useStore((state) => state.mapImgAlpha);
  const mapRefPoint = useStore((state) => state.mapRefPoint);
  const mapPixelSize = useStore((state) => state.mapPixelSize);
  const referenceMarkers = useStore((state) => state.referenceMarkers);
  const [cameraMatrix, distortion] = useStore(
    (state) => [state.cameraMatrix, state.distortion],
    shallow
  );
  const [mapRefPoint2LeftTopMeters, mapPixel2Meters] = useStore(
    (state) => [state.mapRefPoint2LeftTopMeters, state.mapPixel2Meters],
    shallow
  );

  const mapCenter = useStore((state) => state.mapCenter);

  useEffect(() => {
    let tmpImg = new Image();
    tmpImg.onload = function () {
      const cvImg = image2cvMat(tmpImg);
      const mapRefPointXY2D = mapMarkers.map((latlng) =>
        projectexy(mapRefPoint, latlng)
      );
      const mapRefPointXY3D = mapRefPointXY2D.map((xy) => [...xy, 0]);
      let mapRef3DM = jsarray2cvMat(mapRefPointXY3D);

      const invRefMarker = referenceMarkers.map((el) => [
        el[1],
        refImg.height - el[0],
      ]);
      let Ref2DPX = jsarray2cvMat(invRefMarker);

      let cameraMat = jsarray2cvMat(cameraMatrix);

      let distrMat = jsarray2cvMat(distortion);

      let rvec = new cv.Mat(3, 1, cv.CV_64FC1);
      let tvec = new cv.Mat(3, 1, cv.CV_64FC1);

      cv.solvePnP(mapRef3DM, Ref2DPX, cameraMat, distrMat, rvec, tvec, false);
      let homoRmat = homographyfromepnp(rvec, tvec);

      let tmpres = new cv.Mat(3, 3, cv.CV_64FC1);
      let zeros = new cv.Mat.zeros(3, 3, cv.CV_64FC1);
      cv.gemm(cameraMat, homoRmat, 1, zeros, 0, tmpres, 0); // Matrix Multiplication

      // row major!
      // [[0 1 2],
      //  [3 4 5],
      //  [6 7 8]]
      let mapScaling = new cv.Mat.zeros(3, 3, cv.CV_64FC1);
      mapScaling.data64F[0] = mapPixel2Meters;
      mapScaling.data64F[4] = mapPixel2Meters;
      mapScaling.data64F[8] = 1;
      mapScaling.data64F[2] = mapRefPoint2LeftTopMeters[0] * mapPixel2Meters;
      mapScaling.data64F[5] = mapRefPoint2LeftTopMeters[1] * mapPixel2Meters;

      let homgrToImg = new cv.Mat.zeros(3, 3, cv.CV_64FC1);
      let cvMattmp = new cv.Mat.zeros(3, 3, cv.CV_64FC1);
      let cvImgWarped = new cv.Mat.zeros(3, 3, cv.CV_64FC1);

      cv.gemm(mapScaling, tmpres.inv(cv.DECOMP_LU), 1, zeros, 0, homgrToImg, 0); // Matrix Multiplication
      cv.undistort(cvImg, cvMattmp, cameraMat, distrMat);
      cv.warpPerspective(cvMattmp, cvImgWarped, homgrToImg, mapPixelSize);
      let homgrToGeocord = tmpres.inv(cv.DECOMP_LU);

      const warpedImg = new ImageData(
        new Uint8ClampedArray(cvImgWarped.data),
        cvImgWarped.cols,
        cvImgWarped.rows
      );

      for (let i = 0; i < warpedImg.data.length; i += 4) {
        if (warpedImg.data[i + 3] > 0) {
          warpedImg.data[i + 3] = mapImgAlpha;
        }
      }

      if (outCanvas.current) {
        const canvas = outCanvas.current;
        const ctx = canvas.getContext("2d");
        canvas.width = mapPixelSize.width;
        canvas.height = mapPixelSize.height;
        ctx.putImageData(warpedImg, 0, 0);
      }
      // opencv.js does not garbage collect!
      cvImg.delete();
      mapRef3DM.delete();
      Ref2DPX.delete();
      cameraMat.delete();
      distrMat.delete();
      homgrToImg.delete();
      rvec.delete();
      tvec.delete();
      homoRmat.delete();
      zeros.delete();
      tmpres.delete();
      mapScaling.delete();
      homgrToGeocord.delete();
      cvMattmp.delete();
      cvImgWarped.delete();
    };
    tmpImg.src = refImg.url;
  }, [
    mapMarkers,
    referenceMarkers,
    mapRefPoint,
    mapImgAlpha,
    mapCenter,
    mapPixelSize,
    cameraMatrix,
    distortion,
  ]);

  return (
    <>
      <canvas id="ImgOverlay" ref={outCanvas} {...props} />
    </>
  );
}
