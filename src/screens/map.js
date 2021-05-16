import React, { useState, useEffect, useRef } from "react";
import { Platform, Text, View, StyleSheet, Button } from "react-native";
import { getAllPointsOfInterest } from "../helpers/prismic";

import {
  startGeofencingTask,
  getCurrentMapPositionAsync,
  startLocationUpdatesTask,
  stopAllLocationTasksAsync,
  isBackgroundTasksInProgressAsync,
} from "../helpers/location";

import MapView from "react-native-maps";
import { Circle, Marker } from "react-native-maps";

const GeofenceWatch = ({ style, dangerousLocations }) => {
  const [isWatchingGeoFence, setIsWatchingGeoFence] = useState(false);

  useEffect(() => {
    (async () => {
      //check if the background tasks are still running from the last app session
      const isBackgroundTasksInProgress = await isBackgroundTasksInProgressAsync();

      if (isBackgroundTasksInProgress) {
        setIsWatchingGeoFence(true);
      } else {
        stopAllLocationTasksAsync();
        setIsWatchingGeoFence(false);
      }
    })();
  }, []);
  return (
    <View style={style}>
      <Text>Press the button to start watching dangerous locations.</Text>
      <Text>
        You will receive a push notification when entering a red zone.
      </Text>
      <Text>
        This will continue to monitor while the app is in the background.
      </Text>
      <Button
        onPress={async () => {
          if (isWatchingGeoFence) {
            stopAllLocationTasksAsync();
            setIsWatchingGeoFence(false);
            return;
          }

          startGeofencingTask(dangerousLocations);
          startLocationUpdatesTask();
          setIsWatchingGeoFence(true);
        }}
        title={isWatchingGeoFence ? "Stop Watching" : "Start Watching"}
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
};

export default function Map({ route, navigation }) {
  const [initialPosition, setInitialPosition] = useState(undefined);
  const [dangerousLocations, setDangerousLocations] = useState([]);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  useEffect(() => {
    (async () => {
      const pointsOfInterest = await getAllPointsOfInterest();
      setPointsOfInterest(pointsOfInterest);
      const allDangerousLocationsForAllPointsOfInterest = [];

      pointsOfInterest.forEach((item) => {
        item.dangerousLocations.forEach((dangerousLocation) => {
          dangerousLocation.notifyOnEnter = true;
          dangerousLocation.identifier = dangerousLocation.name;
          allDangerousLocationsForAllPointsOfInterest.push(dangerousLocation);
        });
      });
      setDangerousLocations(allDangerousLocationsForAllPointsOfInterest);

      setInitialPosition(await getCurrentMapPositionAsync());
    })();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    paragraph: {},
    map: {
      flex: 1,
    },
    geoFenceWatch: { padding: 20 },
  });

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={initialPosition}
        showsUserLocation={true}
        style={styles.map}
        followsUserLocation={true}
      >
        {dangerousLocations.map((item, index) => {
          return (
            <Circle
              key={index}
              fillColor={"rgba(255,204,203,0.5)"}
              strokeColor={"rgb(255,0,0)"}
              center={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              radius={item.radius}
            ></Circle>
          );
        })}
        {dangerousLocations.map((item, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              onPress={() => {
                navigation.navigate("DangerousLocation", item);
              }}
            >
              <View>
                <Text style={{ color: "red" }}>{item.name}</Text>
              </View>
            </Marker>
          );
        })}

        {pointsOfInterest.map((item, index) => {
          return (
            <Marker
              key={index}
              coordinate={item.geoPoint}
              onPress={() => {
                navigation.navigate("PointOfInterest", item);
              }}
            >
              <View>
                <Text style={{ color: "black" }}>{item.name}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>
      <GeofenceWatch
        dangerousLocations={dangerousLocations}
        style={styles.geoFenceWatch}
      ></GeofenceWatch>
    </View>
  );
}
