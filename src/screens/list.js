import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
} from "react-native";
import {
  getAllPointsOfInterest,
  getAllFilters,
  getPointsOfInterestByFilter,
} from "../helpers/prismic";
import BouncyCheckbox from "react-native-bouncy-checkbox/lib/BouncyCheckbox";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 22,
    flexDirection: "column",
    backgroundColor: "white",
  },
  text: {
    padding: 10,
    fontSize: 18,
    // marginLeft: 5,
  },
});

const List = ({ navigation }) => {
  const [pointOfInterests, setPointOfInterests] = useState(null);
  const [filters, setFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(false);

  const setPointsOfInterest = async (filter) => {
    const allFilters = await getAllFilters();
    setFilters(allFilters);

    const parsedData = filter
      ? await getPointsOfInterestByFilter(selectedFilter)
      : await getAllPointsOfInterest();

    // console.log(selectedFilter);
    setPointOfInterests(parsedData);
  };

  useEffect(() => {
    (async () => {
      const unsubscribe = navigation
        .dangerouslyGetParent()
        .addListener("tabPress", async (e) => {
          setPointsOfInterest();
          setSelectedFilter(false);
        });

      // console.log("useeffect called");
      setPointsOfInterest();

      return unsubscribe;
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setPointsOfInterest(selectedFilter);
    })();
  }, [selectedFilter]);

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

  const renderFilterButtons = () => {};

  return (
    <View style={styles.container}>
      <View>
        {filters.map((filter, index) => {
          return (
            <BouncyCheckbox
              isChecked={selectedFilter === filter.id}
              disableBuiltInState={true}
              key={index}
              text={filter.name}
              onPress={(isChecked) => {
                setSelectedFilter(filter.id);
              }}
            />
          );
        })}
      </View>

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
