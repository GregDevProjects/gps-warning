import * as Location from "expo-location";

const isLocationPermissionGiven = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return false;
  }

  let statusBackground = await Location.requestBackgroundPermissionsAsync();

  if (statusBackground.status !== "granted") {
    return false;
  }
  return true;
};

export default isLocationPermissionGiven;
