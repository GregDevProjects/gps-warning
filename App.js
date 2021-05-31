import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DebugScreen from "./src/screens/debug";
import ListScreen from "./src/screens/list";
import PointOfInterestScreen from "./src/screens/point_of_interest";
import DangerousLocationScreen from "./src/screens/dangerous_location";
import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "./src/screens/map";
import * as Notifications from "expo-notifications";

const Tab = createBottomTabNavigator();

const RootStack = createStackNavigator();

const PointOfInterestStack = () => (
  <RootStack.Navigator>
    <RootStack.Screen name="List" component={ListScreen} />
    <RootStack.Screen
      name="PointOfInterest"
      component={PointOfInterestScreen}
    />
  </RootStack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="List">
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarLabel: "Map",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={"map"} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="List"
          component={PointOfInterestStack}
          options={{
            tabBarLabel: "Points of interest",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="list" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Debug"
          component={DebugScreen}
          options={{
            tabBarLabel: "Debug",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="list" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
