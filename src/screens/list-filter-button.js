import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import {
  getAllPointsOfInterest,
  getAllFilters,
  getPointsOfInterestByFilter,
} from "../helpers/prismic";
import BouncyCheckbox from "react-native-bouncy-checkbox/lib/BouncyCheckbox";
import Distance from "../helpers/distanceAsCrowFlies";
import {
  getCurrentMapPositionAsync,
  isLocationPermissionGiven,
} from "../helpers/location";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 22,
    flexDirection: "column",
    backgroundColor: "white",
  },
  textDistance: {
    padding: 10,
    fontSize: 18,
    color: "white",
    position: "absolute",
    bottom: 0,
    marginLeft: 10,
  },
  text: {
    padding: 10,
    fontSize: 18,
    position: "absolute",
    color: "white",
    marginLeft: 10,
    marginTop: 5,
  },
});

//TODO: BUG!!! switching filters quickly causes crash
//
const FilterButton = ({ text, isSelected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          borderStyle: "solid",
          borderColor: isSelected ? "#1E90FF" : "grey",
          borderWidth: 1,
          borderRadius: 15,
          padding: 10,
          margin: 10,
          backgroundColor: isSelected ? "#1E90FF" : "white",
        },
      ]}
    >
      <Text style={{ color: isSelected ? "white" : "black" }}>{text}</Text>
    </Pressable>
  );
};

const List = ({ navigation }) => {
  const [pointOfInterests, setPointOfInterests] = useState(null);
  const [filters, setFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(false);

  //retrieves all points of interest and filters from Prismic
  // assigns them to state variables on retireval
  const retrieveFiltersAndPointsOfInterest = async (filter) => {
    const allFilters = await getAllFilters();
    setFilters(allFilters);

    const parsedData = filter
      ? await getPointsOfInterestByFilter(selectedFilter)
      : await getAllPointsOfInterest();

    setPointOfInterests(parsedData);
    addDistance(parsedData);
  };

  //Get current location and assign distance to the points of interest array
  const addDistance = async (parsedData) => {
    let permissionsGiven = await isLocationPermissionGiven();
    if (permissionsGiven) {
      const clientLocation = await getCurrentMapPositionAsync();

      const pointsOfInterestWithDistance = parsedData.map((location) => {
        const lat1 = location.geoPoint.latitude;
        const long1 = location.geoPoint.longitude;
        const lat2 = clientLocation.latitude;
        const long2 = clientLocation.longitude;
        const distanceKm = Distance(lat1, long1, lat2, long2);
        location.distanceKm = distanceKm;
        return location;
      });

      const pointsOfInterestWithDistanceSorted = pointsOfInterestWithDistance.sort(
        (el1, el2) => {
          return el1.distanceKm - el2.distanceKm;
        }
      );

      setPointOfInterests(pointsOfInterestWithDistanceSorted);
    }
  };

  useEffect(() => {
    (async () => {
      const unsubscribe = navigation
        .dangerouslyGetParent()
        .addListener("tabPress", async (e) => {
          //when this page is navigated to via tab
          retrieveFiltersAndPointsOfInterest();
          setSelectedFilter(false);
        });

      retrieveFiltersAndPointsOfInterest();

      return unsubscribe;
    })();
  }, []);

  useEffect(() => {
    (async () => {
      retrieveFiltersAndPointsOfInterest(selectedFilter);
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
          navigation.navigate("PointOfInterest", item);
        }}
        style={({ pressed }) => [
          {
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
            {item.distanceKm && (
              <Text style={styles.textDistance}>
                {item.distanceKm.toFixed(2) + " Km"}
              </Text>
            )}
          </>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ display: "flex", flexDirection: "row", maxHeight: 65 }}
      >
        {filters.map((filter, index) => {
          return (
            <FilterButton
              key={index}
              text={filter.name}
              isSelected={selectedFilter === filter.id}
              onPress={() => {
                setSelectedFilter(filter.id);
              }}
            ></FilterButton>
          );
        })}
      </ScrollView>
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
