import * as Location from "expo-location";
import { sendLocalNotification } from "./pushNotifications";
import * as TaskManager from "expo-task-manager";
import { LocationGeofencingEventType } from "expo-location";

import pointInPolygon from "point-in-polygon";

const GEOFENCE_TASK_NAME = "IN_GEOFENCE";
const LOCATION_UPDATE_TASK_NAME = "LOCATION_POLL";
const BACKGROUND_TASK_TITLE = "TAP PROTOTYPE";
const BACKGROUND_TASK_BODY =
  "Tap prototype is watching for dangerous locations";
const latitudeDelta = 0.006;
const longitudeDelta = 0.006;

//used by LOCATION_UPDATE_TASK_NAME
let dangerousLocationPolygons = [];

TaskManager.defineTask(
  GEOFENCE_TASK_NAME,
  ({ data: { eventType, region }, error }) => {
    if (error) {
      console.error(error.message);
      return;
    }

    if (eventType === LocationGeofencingEventType.Enter) {
      const content = { title: `You've entered region: ${region.identifier}` };
      sendLocalNotification(content);
    } else if (eventType === LocationGeofencingEventType.Exit) {
      console.log(
        `You are entering ${region.identifier}, please exercise caution!`
      );
    }
  }
);

TaskManager.defineTask(
  LOCATION_UPDATE_TASK_NAME,
  ({ data: { locations }, error }) => {
    if (error) {
      // check `error.message` for more details.
      return;
    }

    const { latitude, longitude } = locations[0].coords;

    dangerousLocationPolygons.forEach((point, index, array) => {
      if (!point.polygon) {
        return;
      }
      const polygon = parsePolygon(point.polygon);
      const inPolygon = pointInPolygon([latitude, longitude], polygon);
      if (inPolygon && !point.notified) {
        const pushContent = {
          title: `You are entering ${region.identifier}, please exercise caution!`,
        };
        sendLocalNotification(pushContent);
        array[index].notified = true;
      }
      if (!inPolygon) {
        array[index].notified = false;
      }
    });
  }
);

const parsePolygon = (coordsArray) => {
  const result = coordsArray.map((coords) => {
    return [coords.latitude, coords.longitude];
  });
  return result;
};

/**
 * requests permissions to retrieve background and foreground location
 *
 * @return {Boolean} True if given, false if denied
 */
const isLocationPermissionGiven = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return false;
  }

  const statusBackground = await Location.requestBackgroundPermissionsAsync();

  if (statusBackground.status !== "granted") {
    return false;
  }
  return true;
};

//TODO: TEST DIFFERENT ACCURACY AND BATTERY POWER
/**
 * start getting location updates in the foreground and background
 * https://docs.expo.io/versions/latest/sdk/location/#locationstartlocationupdatesasynctaskname-options
 *
 */
const startLocationUpdatesTask = (polygonArray) => {
  dangerousLocationPolygons = polygonArray;
  Location.startLocationUpdatesAsync(LOCATION_UPDATE_TASK_NAME, {
    accuracy: Location.LocationAccuracy.BestForNavigation,
    foregroundService: {
      notificationTitle: BACKGROUND_TASK_TITLE,
      notificationBody: BACKGROUND_TASK_BODY,
    },
  });
};

const startGeofencingTask = (regions) =>
  Location.startGeofencingAsync(GEOFENCE_TASK_NAME, regions);

//TODO: add permission check to this and all location calls
const getCurrentMapPositionAsync = async () => {
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.LocationAccuracy.Highest,
  });

  return getMapPosition(location.coords.latitude, location.coords.longitude);
};

/**
 * Returns a position that's formatted for the react-native-maps MapView
 *
 * @param {*} latitude
 * @param {*} longitude
 * @return {*}
 */
const getMapPosition = (latitude, longitude) => {
  return {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
  };
};

const stopAllLocationTasksAsync = async () => {
  try {
    await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
  } catch (err) {
    console.log(err);
  }

  try {
    await Location.stopLocationUpdatesAsync(LOCATION_UPDATE_TASK_NAME);
  } catch (err) {
    console.log(err);
  }

  try {
    await TaskManager.unregisterAllTasksAsync();
  } catch (err) {
    console.log(err);
  }
};

const isBackgroundTasksInProgressAsync = async () => {
  const locationUpdatesInProgress = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_UPDATE_TASK_NAME
  );

  const geoFenceWatchInProgress = await Location.hasStartedGeofencingAsync(
    GEOFENCE_TASK_NAME
  );

  return locationUpdatesInProgress && geoFenceWatchInProgress;
};

export {
  isLocationPermissionGiven,
  startLocationUpdatesTask,
  startGeofencingTask,
  getCurrentMapPositionAsync,
  stopAllLocationTasksAsync,
  isBackgroundTasksInProgressAsync,
  getMapPosition,
};
