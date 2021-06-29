import React, { useState, useEffect, useRef } from "react";
import { Platform, Text, View, StyleSheet, Button } from "react-native";
import { getAllPointsOfInterest } from "../helpers/prismic";

import {
  startGeofencingTask,
  getCurrentMapPositionAsync,
  startLocationUpdatesTask,
  stopAllLocationTasksAsync,
  isBackgroundTasksInProgressAsync,
  isLocationPermissionGiven,
  getMapPosition,
} from "../helpers/location";

import MapView from "react-native-maps";
import { Marker, Polygon } from "react-native-maps";
import Config from "react-native-config";

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
          // startGeofencingTask(dangerousLocations);
          startLocationUpdatesTask(dangerousLocations);
          setIsWatchingGeoFence(true);
        }}
        title={isWatchingGeoFence ? "Stop Watching" : "Start Watching"}
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
};

const Map = ({ route, navigation }) => {
  const [initialPosition, setInitialPosition] = useState(undefined);
  const [dangerousLocations, setDangerousLocations] = useState([]);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);

  //TODO: clean up
  const setAllDangerousLocations = async () => {
    const pointsOfInterest = await getAllPointsOfInterest();
    setPointsOfInterest(pointsOfInterest);

    const allDangerousLocationsForAllPointsOfInterest = [];

    pointsOfInterest.forEach((item) => {
      item.dangerousLocations.forEach((dangerousLocation) => {
        dangerousLocation.identifier = dangerousLocation.name;
        allDangerousLocationsForAllPointsOfInterest.push(dangerousLocation);
      });
    });
    setDangerousLocations(allDangerousLocationsForAllPointsOfInterest);
  };

  const setMapPositionToCurrentLocation = async () => {
    let permissionsGiven = await isLocationPermissionGiven();

    if (permissionsGiven) {
      //TODO: error message if permissions not given
      const currentPosition = await getCurrentMapPositionAsync();
      // return;
      setInitialPosition(currentPosition);
    }
  };

  //called once when the map is navigated to for the first time
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      setMapPositionToCurrentLocation();
    });

    if (!route.params.initialMapLocation) {
      setMapPositionToCurrentLocation();
      return unsubscribe;
    }

    return unsubscribe;
  }, []);

  //called when the map is navigated to for the first time, and on route changes
  useEffect(() => {
    //TODO: figure out best time to update dangerous locations
    setAllDangerousLocations();

    const { initialMapLocation } = route.params;

    if (!initialMapLocation) {
      return;
    }

    const newPosition = getMapPosition(
      initialMapLocation.latitude,
      initialMapLocation.longitude
    );

    setInitialPosition(newPosition);
  }, [route]);

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
        region={initialPosition}
        showsUserLocation={true}
        style={styles.map}
      >
        {dangerousLocations.map((item, index) => {
          if (!item.polygon) {
            return;
          }
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: item.polygon[0].latitude,
                longitude: item.polygon[0].longitude,
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
        {dangerousLocations.map((item, index) => {
          if (!item.polygon) {
            return;
          }
          return (
            <Polygon
              key={index}
              fillColor={"rgba(255,204,203,0.5)"}
              coordinates={item.polygon}
              strokeColor={"rgb(255,0,0)"}
            />
          );
        })}
      </MapView>
      <GeofenceWatch
        dangerousLocations={dangerousLocations}
        style={styles.geoFenceWatch}
      ></GeofenceWatch>
    </View>
  );
};

export default Map;
