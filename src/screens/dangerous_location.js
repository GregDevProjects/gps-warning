import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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

  const { name, description } = route.params;

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 50 }}>{name}</Text>
      <Text>{description}</Text>
    </View>
  );
};

export default DangerousLocation;
