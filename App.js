//https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md MAP INSTALL
import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet, Button } from "react-native";
import * as Location from "expo-location";
import isLocationPermissionGiven from "./src/isLocationPermissionGiven";
import regions from "./test_data/regions";
import * as TaskManager from "expo-task-manager";
import { LocationGeofencingEventType } from "expo-location";
import MapView from "react-native-maps";
import { Circle } from "react-native-maps";

//import Config from "react-native-config";
//console.log("KEY", Config);

const TASK_NAME = "IN_GEOFENCE";

TaskManager.defineTask(TASK_NAME, ({ data: { eventType, region }, error }) => {
  if (error) {
    console.error(error.message);
    // check `error.message` for more details.
    return;
  }

  // console.log(region);

  if (eventType === LocationGeofencingEventType.Enter) {
    alert(`You've entered region: ${region.identifier}`);
  } else if (eventType === LocationGeofencingEventType.Exit) {
    alert(`You've left region: ${region.identifier}`);
  }
});

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [buttonText, setButtonText] = useState("Check geofencing status");
  const [tasks, setTasks] = useState("Tasks displayed here");
  const [initialPosition, setInitialPosition] = useState(undefined);

  useEffect(() => {
    (async () => {
      let permissionsGiven = await isLocationPermissionGiven();
      let tasks = undefined;
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

        const location = await Location.getCurrentPositionAsync();

        setInitialPosition({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.006,
          longitudeDelta: 0.006,
        });

        console.log("Got location", location);
      }
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else {
    text = "Permissions given";
  }

  const styles = StyleSheet.create({
    container: {},
    paragraph: {},
    map: {
      width: 300,
      height: 500,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
      <Text style={styles.paragraph}>{tasks}</Text>
      <Button
        onPress={async () => {
          const isGeoFencing = await Location.hasStartedGeofencingAsync(
            TASK_NAME
          );

          if (isGeoFencing) {
            setButtonText("Working");

            const tasks = await TaskManager.getRegisteredTasksAsync();
            setTasks(JSON.stringify(tasks));
            return;
          }

          setButtonText("Error");
        }}
        title={buttonText}
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <MapView
        initialRegion={initialPosition}
        showsUserLocation={true}
        style={styles.map}
      >
        {regions.map((region, index) => (
          <Circle
            key={index}
            center={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            radius={region.radius}
          ></Circle>
        ))}
      </MapView>
    </View>
  );
}
