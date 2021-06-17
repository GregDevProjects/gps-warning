import React from "react";
import { Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ActionItem = ({ text, onPress, noBoarder, icon }) => {
  return (
    <Pressable
      style={{
        height: 50,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "grey",
        borderTopWidth: noBoarder ? 0 : 1,
      }}
      onPress={onPress}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color="black"
        style={{ marginRight: 20 }}
      />
      <Text>{text}</Text>
      <MaterialIcons
        name="chevron-right"
        size={24}
        color="black"
        style={{ marginLeft: "auto" }}
      />
    </Pressable>
  );
};

export default ActionItem;
