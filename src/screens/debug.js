import React, { useState, useEffect, useRef } from "react";
import { Platform, Text, View, StyleSheet, Button } from "react-native";
import * as Location from "expo-location";
import {
  isLocationPermissionGiven,
  startLocationUpdatesTask,
  startGeofencingTask,
  getCurrentMapPositionAsync,
} from "../helpers/location";
import regions from "../../test_data/regions";
import * as TaskManager from "expo-task-manager";

import Config from "react-native-config";

import MapView from "react-native-maps";
import { Circle } from "react-native-maps";
import * as Notifications from "expo-notifications";

import {
  sendLocalNotification,
  registerForPushNotificationsAsync,
} from "../helpers/pushNotifications";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [buttonText, setButtonText] = useState("Check background tasks");
  const [tasks, setTasks] = useState("Tasks displayed here");
  const [initialPosition, setInitialPosition] = useState(undefined);

  useEffect(() => {
    (async () => {})();
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
          let permissionsGiven = await isLocationPermissionGiven();
          if (!permissionsGiven) {
            setErrorMsg("Permission not granted!");
            return;
          }
        }}
        title={"Request ForeGround Permission"}
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <Button
        onPress={async () => {
          const statusBackground = await Location.requestBackgroundPermissionsAsync();

          if (statusBackground.status !== "granted") {
            return false;
          }
        }}
        title={"Request Background Permission"}
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <Button
        onPress={async () => {
          await registerForPushNotificationsAsync();
          sendLocalNotification({ title: "test title" });
        }}
        title={"Send a push"}
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}
