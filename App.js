import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet, Button } from "react-native";
import * as Location from "expo-location";
import isLocationPermissionGiven from "./src/isLocationPermissionGiven";

import * as TaskManager from "expo-task-manager";
import { LocationGeofencingEventType } from "expo-location";
const TASK_NAME = "IN_GEOFENCE";

TaskManager.defineTask(TASK_NAME, ({ data: { eventType, region }, error }) => {
  console.log("task manager invoked");
  if (error) {
    console.error(error);
    // check `error.message` for more details.
    return;
  }

  console.log(eventType);

  if (eventType === LocationGeofencingEventType.Enter) {
    alert("You've entered region:", eventType.identifier);
  } else if (eventType === LocationGeofencingEventType.Exit) {
    alert("You've left region:", eventType.identifier);
  }
});

const regions = [
  {
    identifier: "test_identifier",
    latitude: 44.6683, //44.66821413533673,
    longitude: -63.6074, //-63.6072027683258,
    radius: 1000,
    notifyOnEnter: true,
    notifyOnExit: true,
  },
  {
    identifier: "home",
    latitude: 44.6618291, //44.66821413533673,
    longitude: -63.6005524, //-63.6072027683258,
    radius: 1000,
    notifyOnEnter: true,
    notifyOnExit: true,
  },
];

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [buttonText, setButtonText] = useState("Check geofencing status");

  useEffect(() => {
    (async () => {
      let permissionsGiven = await isLocationPermissionGiven();

      if (!permissionsGiven) {
        setErrorMsg("Permission not granted!");
        return;
      }
      // https://docs.expo.io/versions/latest/sdk/location/#locationstartlocationupdatesasynctaskname-options
      // Location.startLocationUpdatesAsync

      const isTaskManagerEnabled = TaskManager.isAvailableAsync();

      if (isTaskManagerEnabled) {
        console.log("Task manager enabled, starting geofence");
        Location.startGeofencingAsync(TASK_NAME, regions);
      }

      // let location = await Location.startLocationUpdatesAsync("LOCATION_CHECK");
      // setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else {
    text = "Permissions given";
  }

  const styles = StyleSheet.create({ container: {}, paragraph: {} });

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
      <Button
        onPress={async () => {
          const isGeoFencing = await Location.hasStartedGeofencingAsync(
            TASK_NAME
          );

          if (isGeoFencing) {
            setButtonText("Working");
            return;
          }
          setButtonText("Error");
        }}
        title={buttonText}
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}
