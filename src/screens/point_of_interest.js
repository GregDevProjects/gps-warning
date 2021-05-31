import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
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

  const renderListItem = ({ item }) => {
    return (
      <Pressable
        style={{}}
        onPress={() => {
          console.log(item);
          navigation.navigate("DangerousLocation", item);
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
            marginTop: 20,
          },
        ]}
      >
        {({ pressed }) => <Text style={styles.item}>{item.name}</Text>}
      </Pressable>
    );
  };

  const Hero = () => (
    <View>
      <Image
        style={styles.logoImage}
        source={{
          uri: image,
        }}
      />
      <Text style={styles.logoText}>{name}</Text>
    </View>
  );

  const Body = ({ children }) => <View style={styles.body}>{children}</View>;

  const ActionItem = ({ text, onPress, noBoarder, icon }) => {
    return (
      <Pressable
        style={{
          height: 50,
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          borderColor: "grey",
          borderTopWidth: noBoarder ? 0 : 1,
        }}
        onPress={onPress}
      >
        <MaterialIcons
          name={icon}
          size={24}
          color="black"
          style={{ marginRight: 20 }}
        />
        <Text>{text}</Text>
        <MaterialIcons
          name="chevron-right"
          size={24}
          color="black"
          style={{ marginLeft: "auto" }}
        />
      </Pressable>
    );
  };
  return (
    <ScrollView
      style={{ backgroundColor: "white" }}
      showsVerticalScrollIndicator={false}
    >
      <Hero />
      <Body>
        <ActionItem icon="attach-money" text="Discounts" noBoarder></ActionItem>
        <ActionItem
          onPress={() => {
            navigation.navigate("Map", { geoPoint });
          }}
          icon="location-pin"
          text="View on map"
        ></ActionItem>
        <ActionItem icon="dangerous" text="Dangers"></ActionItem>
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
      </Body>
    </ScrollView>
  );
};

export default PointOfInterest;
