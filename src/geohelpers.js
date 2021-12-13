import { LatLng } from "leaflet";

function decomposeLatLon(latlon) {
  if (latlon instanceof LatLng) {
    return [latlon.lat, latlon.lng];
  } else {
    return latlon;
  }
}

function greatCircleDistance(latlon1, latlon2) {
  const [lat1, lon1] = decomposeLatLon(latlon1);
  const [lat2, lon2] = decomposeLatLon(latlon2);

  const R = 6371e3; // metres

  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
}

function greatCircleAzimuth(latlon1, latlon2) {
  const [lat1, lon1] = decomposeLatLon(latlon1);
  const [lat2, lon2] = decomposeLatLon(latlon2);

  const φ1 = (lat1 * Math.PI) / 180; // φ in radians
  const φ2 = (lat2 * Math.PI) / 180;

  const λ1 = (lon1 * Math.PI) / 180; // λ in radians
  const λ2 = (lon2 * Math.PI) / 180;

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  const θ = Math.atan2(y, x);
  const brng = ((θ * 180) / Math.PI + 360) % 360; // in degrees
  return θ;
}

function projectexy(fromlatlon, tolatlon) {
  const d = greatCircleDistance(fromlatlon, tolatlon);
  const brng = greatCircleAzimuth(fromlatlon, tolatlon);
  return [d * Math.sin(brng), -d * Math.cos(brng)];
}

export { projectexy, greatCircleDistance };
