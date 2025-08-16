// components/BottomNavbar.jsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BottomNavbar() {
  const router = useRouter();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => router.push("/student/home")}>
        <Ionicons name="home" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/student/notes")}>
        <Ionicons name="document-text" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/student/addPost")}
      >
        <Ionicons name="add" size={28} color="#2d6eefff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/student/leaderBoard")}>
        <FontAwesome5 name="trophy" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/student/profile")}>
        <Ionicons name="person" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#2d6eefff",
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    borderRadius: 40,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 40,
  },
  addButton: {
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
});
