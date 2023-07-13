export const deg2rad = (deg) => deg * (Math.PI / 180);

export const _getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in kilometers
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in KM
  return d;
};

export const calculateDistance = (point1, point2) => _getDistanceFromLatLonInKm(
  point1[1], point1[0], point2[1], point2[0],
);
