import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Pressable } from "react-native";
import { getAllPointsOfInterest } from "../helpers/prismic";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const List = ({ navigation }) => {
  const [pointOfInterests, setPointOfInterests] = useState(null);

  useEffect(() => {
    (async () => {
      const parsedData = await getAllPointsOfInterest();
      // console.log(parsedData);
      setPointOfInterests(parsedData);
    })();
  }, []);

  const renderListItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => {
          //   console.log(item.key);
          //PRESS HANDLER GOES HERE
          navigation.navigate("PointOfInterest", item);
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
          },
          styles.wrapperCustom,
        ]}
      >
        {({ pressed }) => <Text style={styles.item}>{item.name}</Text>}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pointOfInterests}
        onPress={(item) => {
          console.log(item);
        }}
        renderItem={renderListItem}
      />
    </View>
  );
};

export default List;
