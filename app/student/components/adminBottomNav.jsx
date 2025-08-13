// components/BottomNavbar.js
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function BottomNavbar({ navigation }) {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home" size={28} color="#0A4D8C" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Notes")}>
        <MaterialIcons name="description" size={28} color="#0A4D8C" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Add")}>
        <View style={styles.addButton}>
          <Ionicons name="add" size={28} color="#fff" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Trophy")}>
        <FontAwesome5 name="trophy" size={26} color="#0A4D8C" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Ionicons name="person-outline" size={28} color="#0A4D8C" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#E6F0FA",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 4, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  addButton: {
    backgroundColor: "#0A4D8C",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
