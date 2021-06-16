import React, { useEffect, useState } from "react";
import { StyleSheet, Text, Image, FlatList, Pressable } from "react-native";
import ActionItem from "../components/ActionItem";
import ImageCardScreen from "../components/ImageCardScreen";

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  logoImage: {
    width: "100%",
    aspectRatio: 1,
  },
  logoText: {
    fontSize: 50,
    position: "absolute",
    bottom: 20,
    color: "white",
    left: 15,
  },
  body: {
    backgroundColor: "white",
    borderRadius: 15,
    position: "relative",
    bottom: 20,
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
});

const PointOfInterest = ({ route, navigation }) => {
  const [pointOfInterests, setPointOfInterests] = useState(null);

  useEffect(() => {
    (async () => {
      // const test = await fetchData(route.params.id);
      // const parsedData = parseData(test);
      // console.log(parsedData);
      // const parsedData = parseData(test);
      // setPointOfInterests(parsedData);
    })();
  }, []);

  const {
    image,
    name,
    description,
    dangerousLocations,
    geoPoint,
  } = route.params;

  const DangerousLocations = () => (
    <>
      <Text
        style={{
          fontSize: 30,
          color: "black",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Dangers
      </Text>
      <FlatList
        data={dangerousLocations}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ marginRight: -15, marginLeft: -15 }}
        renderItem={({ item, index, separators }) => (
          <Pressable
            style={{
              marginRight: 10,
              marginLeft: index === 0 ? 10 : 0,
            }}
            onPress={() => {
              navigation.navigate("DangerousLocation", item);
            }}
          >
            <Image
              style={{
                borderRadius: 25,
                width: 150,
                aspectRatio: 1,
              }}
              source={{ uri: item.image }}
            ></Image>
            <Text style={{ paddingLeft: 10, paddingTop: 10, width: 150 }}>
              {item.name}
            </Text>
          </Pressable>
        )}
      />
    </>
  );

  const Description = () => (
    <>
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
    </>
  );

  return (
    <ImageCardScreen name={name} image={image}>
      <ActionItem icon="attach-money" text="Discounts" noBoarder></ActionItem>
      <ActionItem
        onPress={() => {
          console.log("SENDING", { initialMapLocation: { ...geoPoint } });
          navigation.navigate("Map", { initialMapLocation: { ...geoPoint } });
        }}
        icon="location-pin"
        text="View on map"
      />
      <Description />
      <DangerousLocations />
    </ImageCardScreen>
  );
};

export default PointOfInterest;
