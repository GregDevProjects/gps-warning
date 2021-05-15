import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Pressable,
} from "react-native";

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
const PointOfInterest = ({ route, navigation }) => {
  const [pointOfInterests, setPointOfInterests] = useState(null);
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

  const { image, name, description, dangerousLocations } = route.params;

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

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 50 }}>{name}</Text>
      <Image
        style={styles.logo}
        source={{
          uri: image,
        }}
      />
      <Text>{description}</Text>
      <Text style={{ fontSize: 30 }}>Dangerous Locations</Text>
      <FlatList
        data={dangerousLocations}
        onPress={(item) => {
          console.log(item);
        }}
        renderItem={renderListItem}
      />
    </View>
  );
};

export default PointOfInterest;
