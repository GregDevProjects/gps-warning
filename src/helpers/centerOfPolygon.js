//Stolen from https://stackoverflow.com/questions/16282330/find-centerpoint-of-polygon-in-javascript
// This should really be an API's responsibility...

/**
 *
 *
 * @param {*} polygon
 * [
 *  {"longitude": -1.2, "latitude": 5.1},
 *  {"longitude": -1.3, "latitude": 5.2},
 * ]
 * @return {Object} {"longitude": -1.3, "latitude": 5.2}
 */
const getCenterOfPolygon = (polygon) => {
  function Point(longitude, latitude) {
    this.longitude = longitude;
    this.latitude = latitude;
  }

  function Region(points) {
    this.points = points || [];
    this.length = points.length;
  }

  Region.prototype.area = function () {
    var area = 0,
      i,
      j,
      point1,
      point2;

    for (i = 0, j = this.length - 1; i < this.length; j = i, i += 1) {
      point1 = this.points[i];
      point2 = this.points[j];
      area += point1.longitude * point2.latitude;
      area -= point1.latitude * point2.longitude;
    }
    area /= 2;

    return area;
  };

  Region.prototype.centroid = function () {
    var longitude = 0,
      latitude = 0,
      i,
      j,
      f,
      point1,
      point2;

    for (i = 0, j = this.length - 1; i < this.length; j = i, i += 1) {
      point1 = this.points[i];
      point2 = this.points[j];
      f =
        point1.longitude * point2.latitude - point2.longitude * point1.latitude;
      longitude += (point1.longitude + point2.longitude) * f;
      latitude += (point1.latitude + point2.latitude) * f;
    }

    f = this.area() * 6;

    return new Point(longitude / f, latitude / f);
  };

  const center = new Region(polygon).centroid();

  return {
    latitude: center.latitude,
    longitude: center.longitude,
  };
};

export default getCenterOfPolygon;
