import React, { useState, useEffect, useRef } from "react";
import { Platform, Text, View, StyleSheet, Button } from "react-native";
import regions from "../../test_data/regions";
import { getAllPointsOfInterest } from "../helpers/prismic";

import {
  startGeofencingTask,
  getCurrentMapPositionAsync,
  startLocationUpdatesTask,
  stopAllLocationTasksAsync,
} from "../helpers/location";

import MapView from "react-native-maps";
import { Circle, Marker } from "react-native-maps";

const GeofenceWatch = ({ style, dangerousLocations }) => {
  const [isWatchingGeoFence, setIsWatchingGeoFence] = useState(false);
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
  useEffect(() => {
    (async () => {
      const pointsOfInterest = await getAllPointsOfInterest();

      const allDangerousLocations = pointsOfInterest.map((item) => {
        const dangerousLocationsWithNotify = item.dangerousLocations.map(
          (dangerousLocation) => {
            dangerousLocation.notifyOnEnter = true;
            dangerousLocation.identifier = dangerousLocation.name;
            return dangerousLocation;
          }
        );

        return dangerousLocationsWithNotify;
      });

      setDangerousLocations(allDangerousLocations[0]);

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
                console.log("Marker Pressed", item);
                navigation.navigate("DangerousLocation", item);
              }}
            >
              <View>
                <Text style={{ color: "red" }}>{item.name}</Text>
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
