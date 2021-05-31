import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
} from "react-native";
import { getAllPointsOfInterest } from "../helpers/prismic";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 22,
    flexDirection: "row",
  },
  text: {
    padding: 10,
    fontSize: 18,
    // marginLeft: 5,
  },
});

const List = ({ navigation }) => {
  const [pointOfInterests, setPointOfInterests] = useState(null);

  useEffect(() => {
    (async () => {
      const unsubscribe = navigation
        .dangerouslyGetParent()
        .addListener("tabPress", async (e) => {
          const parsedData = await getAllPointsOfInterest();
          setPointOfInterests(parsedData);
        });

      const parsedData = await getAllPointsOfInterest();
      setPointOfInterests(parsedData);
      return unsubscribe;
    })();
  }, []);

  const isRightSideItem = (index) => {
    if ((index + 1) % 2 === 0) {
      return true;
    }
    return false;
  };

  const renderListItem = ({ item, index }) => {
    const rightSide = isRightSideItem(index);

    return (
      <Pressable
        onPress={() => {
          //console.log(item);
          navigation.navigate("PointOfInterest", item);
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
            width: "50%",
            paddingRight: rightSide ? 10 : 5,
            paddingLeft: rightSide ? 5 : 10,
          },
        ]}
      >
        {({ pressed }) => (
          <>
            <Image
              width={"100%"}
              height={50}
              style={{
                borderRadius: 25,
                width: "100%",
                marginTop: 10,
                aspectRatio: 1,
              }}
              source={{ uri: item.image }}
            ></Image>
            <Text style={styles.text}>{item.name}</Text>
          </>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={2}
        horizontal={false}
        data={pointOfInterests}
        renderItem={renderListItem}
      />
    </View>
  );
};

export default List;
