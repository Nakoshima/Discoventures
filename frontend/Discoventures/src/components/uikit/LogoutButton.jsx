import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../../style/colors";

// Bouton de déconnexion
export default function LogoutButton({ onPress, nativeID }) {
  return (
    <View>
      <Pressable style={styles.container} onPress={onPress} nativeID={nativeID}>
        <Icon name={"logout"} size={20} color={"white"} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 40,
    marginHorizontal: 23,
    backgroundColor: colors.colorError500.color,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
