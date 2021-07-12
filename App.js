import React, { useEffect } from "react";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DebugScreen from "./src/screens/debug";
import ListScreen from "./src/screens/list";
import PointOfInterestScreen from "./src/screens/point_of_interest";
import ListScreenScrollFilter from "./src/screens/list-filter-scroll";
import ListScreenButtonFilter from "./src/screens/list-filter-button";
import DangerousLocationScreen from "./src/screens/dangerous_location";
import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "./src/screens/map";

const Tab = createBottomTabNavigator();

const RootStack = createStackNavigator();

const PointOfInterestStack = () => (
  <RootStack.Navigator>
    <RootStack.Screen name="List" component={ListScreen} />
    <RootStack.Screen
      name="PointOfInterest"
      component={PointOfInterestScreen}
    />
    <RootStack.Screen
      name="DangerousLocation"
      component={DangerousLocationScreen}
    />
  </RootStack.Navigator>
);

const PointOfInterestScrollStack = () => (
  <RootStack.Navigator>
    <RootStack.Screen name="List" component={ListScreenScrollFilter} />
    <RootStack.Screen
      name="PointOfInterest"
      component={PointOfInterestScreen}
    />
    <RootStack.Screen
      name="DangerousLocation"
      component={DangerousLocationScreen}
    />
  </RootStack.Navigator>
);

const PointOfInterestButtonStack = () => (
  <RootStack.Navigator>
    <RootStack.Screen name="List" component={ListScreenButtonFilter} />
    <RootStack.Screen
      name="PointOfInterest"
      component={PointOfInterestScreen}
    />
    <RootStack.Screen
      name="DangerousLocation"
      component={DangerousLocationScreen}
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
          initialParams={{ initialMapLocation: false }}
          options={{
            tabBarLabel: "Map",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={"map"} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="List"
          component={PointOfInterestButtonStack}
          options={{
            tabBarLabel: "Button Filter",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="list" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ListScrollFilter"
          component={PointOfInterestScrollStack}
          options={{
            tabBarLabel: "Scroll Filter",
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
