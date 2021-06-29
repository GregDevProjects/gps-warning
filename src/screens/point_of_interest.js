import React, { useEffect, useState } from "react";
import { Linking, Text, Image, FlatList, Pressable } from "react-native";
import ActionItem from "../components/ActionItem";
import ImageCardScreen from "../components/ImageCardScreen";

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
    phone,
    website,
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
        Hazards
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
      <ActionItem
        icon="call"
        text="Phone"
        noBoarder
        onPress={() => {
          Linking.openURL(`tel:${phone}`);
        }}
      ></ActionItem>
      <ActionItem
        icon="public"
        text="Website"
        onPress={() => {
          Linking.openURL(website);
        }}
      ></ActionItem>
      <ActionItem
        onPress={() => {
          console.log("SENDING", { initialMapLocation: { ...geoPoint } });
          navigation.navigate("Map", { initialMapLocation: { ...geoPoint } });
        }}
        icon="location-pin"
        text="View on map"
      />
      <Description />
      {dangerousLocations.length > 0 && <DangerousLocations />}
    </ImageCardScreen>
  );
};

export default PointOfInterest;
