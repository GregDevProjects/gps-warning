import * as React from "react";
import { Text, View } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DebugScreen from "./src/screens/debug";
import ListScreen from "./src/screens/list";
import PointOfInterestScreen from "./src/screens/point_of_interest";
import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "./src/screens/map";

const Tab = createBottomTabNavigator();

const RootStack = createStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
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
        component={ListScreen}
        options={{
          tabBarLabel: "List",
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
            <FontAwesome5 name="question" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={MyTabs} />
        <RootStack.Screen
          name="PointOfInterest"
          component={PointOfInterestScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
