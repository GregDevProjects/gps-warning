//https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md MAP INSTALL
import React, { useState, useEffect, useRef } from "react";
import { Platform, Text, View, StyleSheet, Button } from "react-native";
import * as Location from "expo-location";
import {
  isLocationPermissionGiven,
  startLocationUpdatesTask,
  startGeofencingTask,
  getCurrentMapPositionAsync,
} from "./src/helpers/location";
import regions from "./test_data/regions";
import * as TaskManager from "expo-task-manager";

import MapView from "react-native-maps";
import { Circle } from "react-native-maps";
import * as Notifications from "expo-notifications";

import { registerForPushNotificationsAsync } from "./src/helpers/pushNotifications";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [buttonText, setButtonText] = useState("Check geofencing status");
  const [tasks, setTasks] = useState("Tasks displayed here");
  const [initialPosition, setInitialPosition] = useState(undefined);

  useEffect(() => {
    (async () => {
      await registerForPushNotificationsAsync();

      let permissionsGiven = await isLocationPermissionGiven();
      if (!permissionsGiven) {
        setErrorMsg("Permission not granted!");
        return;
      }

      const isTaskManagerEnabled = await TaskManager.isAvailableAsync();

      if (isTaskManagerEnabled) {
        console.log("Task manager enabled, starting geofence");
        //TODO: TEST IF WE CAN REMOVE THIS
        const unregisterAllTasks = await TaskManager.unregisterAllTasksAsync();

        console.log(`UNREGESTERED: ${unregisterAllTasks}`);

        startGeofencingTask(regions);

        setInitialPosition(await getCurrentMapPositionAsync());
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
      width: "100%",
      height: 500,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
      <Text style={styles.paragraph}>{tasks}</Text>
      <Button
        onPress={async () => {
          const content = { title: "I am a one, hasty notification." };

          Notifications.scheduleNotificationAsync({ content, trigger: null });
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
        followsUserLocation={true}
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
