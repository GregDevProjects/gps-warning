//https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md MAP INSTALL
import React, { useState, useEffect, useRef } from "react";
import { Platform, Text, View, StyleSheet, Button } from "react-native";
import * as Location from "expo-location";
import isLocationPermissionGiven from "./src/isLocationPermissionGiven";
import regions from "./test_data/regions";
import * as TaskManager from "expo-task-manager";
import { LocationGeofencingEventType } from "expo-location";
import MapView from "react-native-maps";
import { Circle } from "react-native-maps";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});
//TODO: TEST DIFFERENT ACCURACY'S AND BATTERY POWER
TaskManager.defineTask("LOCATION_POLL", ({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  // console.log("Received new locations", locations);
});

const TASK_NAME = "IN_GEOFENCE";

TaskManager.defineTask(TASK_NAME, ({ data: { eventType, region }, error }) => {
  if (error) {
    console.error(error.message);
    // check `error.message` for more details.
    return;
  }

  if (eventType === LocationGeofencingEventType.Enter) {
    console.log(`You've entered region: ${region.identifier}`);
    const content = { title: `You've entered region: ${region.identifier}` };
    Notifications.scheduleNotificationAsync({ content, trigger: null });
  } else if (eventType === LocationGeofencingEventType.Exit) {
    console.log(`You've left region: ${region.identifier}`);
    // const content = { title: `You've left region: ${region.identifier}` };
    // Notifications.scheduleNotificationAsync({ content, trigger: null });
  }
});

registerForPushNotificationsAsync = async () => {
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    this.setState({ expoPushToken: token });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [buttonText, setButtonText] = useState("Check geofencing status");
  const [tasks, setTasks] = useState("Tasks displayed here");
  const [initialPosition, setInitialPosition] = useState(undefined);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    (async () => {
      //START PUSH CODE
      registerForPushNotificationsAsync().then((token) =>
        setExpoPushToken(token)
      );

      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log("foreground push received ");
        }
      );

      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log("background push received ");
        }
      );
      //END PUSH CODE
      let permissionsGiven = await isLocationPermissionGiven();
      if (!permissionsGiven) {
        setErrorMsg("Permission not granted!");
        return;
      }
      // https://docs.expo.io/versions/latest/sdk/location/#locationstartlocationupdatesasynctaskname-options
      // Location.startLocationUpdatesAsync

      const isTaskManagerEnabled = await TaskManager.isAvailableAsync();

      if (isTaskManagerEnabled) {
        console.log("Task manager enabled, starting geofence");
        //TODO: TEST IF WE CAN REMOVE THIS
        const unregisterAllTasks = await TaskManager.unregisterAllTasksAsync();

        console.log(`UNREGESTERED: ${unregisterAllTasks}`);

        Location.startGeofencingAsync(TASK_NAME, regions);

        const location = await Location.getCurrentPositionAsync();

        setInitialPosition({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.006,
          longitudeDelta: 0.006,
        });

        console.log("Got location", location);

        Location.startLocationUpdatesAsync("LOCATION_POLL", {
          accuracy: Location.LocationAccuracy.BestForNavigation,
          foregroundService: {
            notificationTitle: "FGS title",
            notificationBody: "FGS body",
          },
        });
      }
      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
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
