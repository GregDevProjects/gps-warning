import * as Location from "expo-location";
import { sendLocalNotification } from "./pushNotifications";
import * as TaskManager from "expo-task-manager";
import { LocationGeofencingEventType } from "expo-location";

const GEOFENCE_TASK_NAME = "IN_GEOFENCE";
const LOCATION_UPDATE_TASK_NAME = "LOCATION_POLL";

TaskManager.defineTask(
  GEOFENCE_TASK_NAME,
  ({ data: { eventType, region }, error }) => {
    if (error) {
      console.error(error.message);
      // check `error.message` for more details.
      return;
    }

    if (eventType === LocationGeofencingEventType.Enter) {
      console.log(`You've entered region: ${region.identifier}`);
      const content = { title: `You've entered region: ${region.identifier}` };
      sendLocalNotification(content);
    } else if (eventType === LocationGeofencingEventType.Exit) {
      console.log(`You've left region: ${region.identifier}`);
      // const content = { title: `You've left region: ${region.identifier}` };
      // Notifications.scheduleNotificationAsync({ content, trigger: null });
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
    // console.log("Received new locations", locations);
  }
);

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
const startLocationUpdatesTask = () => {
  Location.startLocationUpdatesAsync(LOCATION_UPDATE_TASK_NAME, {
    accuracy: Location.LocationAccuracy.BestForNavigation,
    foregroundService: {
      notificationTitle: "FGS title",
      notificationBody: "FGS body",
    },
  });
};

const startGeofencingTask = (regions) =>
  Location.startGeofencingAsync(GEOFENCE_TASK_NAME, regions);

const getCurrentMapPositionAsync = async () => {
  const location = await Location.getCurrentPositionAsync();

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.006,
    longitudeDelta: 0.006,
  };
};

export {
  isLocationPermissionGiven,
  startLocationUpdatesTask,
  startGeofencingTask,
  getCurrentMapPositionAsync,
};
