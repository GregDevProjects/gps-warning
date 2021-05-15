import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Config from "react-native-config";
import Prismic from "@prismicio/client";

const apiEndpoint = Config.PRISMIC_API_ENDPOINT;
const accessToken = Config.PRISMIC_API_KEY;

const Client = Prismic.client(apiEndpoint, { accessToken });

const fetchData = async (id) => {
  const response = await Client.query(Prismic.Predicates.at("document.id", id));
  if (response) {
    return response.results;
  }
};

const parseData = (pointOfInterestPrismic) => {
  return pointOfInterestPrismic.map((item) => {
    return {
      key: item.id,
      image: item.data.image.url,
      name: item.data.name,
    };
  });
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
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

  const { image, name, description } = route.params;
  console.log(route.params);
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
    </View>
  );
};

export default PointOfInterest;
