import React from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";

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

const ImageCardScreen = ({ image, name, children }) => {
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

  return (
    <ScrollView
      style={{ backgroundColor: "white" }}
      showsVerticalScrollIndicator={false}
    >
      <Hero />
      <Body>{children}</Body>
    </ScrollView>
  );
};

export default ImageCardScreen;
