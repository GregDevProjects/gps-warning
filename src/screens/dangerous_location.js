import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ImageCardScreen from "../components/ImageCardScreen";
import ActionItem from "../components/ActionItem";

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 100,
    height: 100,
  },
});
const DangerousLocation = ({ route, navigation }) => {
  console.log(route);
  useEffect(() => {
    (async () => {
      // const test = await fetchData(route.params.id);
      // const parsedData = parseData(test);
      // console.log(parsedData);
      // const parsedData = parseData(test);
      // setPointOfInterests(parsedData);
    })();
  }, []);

  const { name, description, image, latitude, longitude } = route.params;

  return (
    <ImageCardScreen name={name} image={image}>
      <ActionItem
        onPress={() => {
          console.log("SENDING", {
            initialMapLocation: { latitude, longitude },
          });
          navigation.navigate("Map", {
            initialMapLocation: { latitude, longitude },
          });
        }}
        icon="location-pin"
        text="View on map"
        noBoarder
      />
      <Text
        style={{
          fontSize: 30,
          color: "black",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        About{" "}
      </Text>
      <Text style={{ marginBottom: 20 }}>{description}</Text>
    </ImageCardScreen>
  );
};

export default DangerousLocation;
