// app/Admin/components/AdminNavbar.jsx
import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AdminNavbar() {
  const router = useRouter();

  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNav}>
        <NavIcon
          label="Home"
          icon="home-outline"
          onPress={() => router.push("/Admin/AdminHome")}
        />
        <NavIcon
          label="Upload Notes"
          icon="cloud-upload-outline"
          onPress={() => router.push("/Admin/AdminUploadNotes")}
        />
        <NavIcon
          label="Ranking"
          icon="trophy-outline"
          onPress={() => router.push("/Admin/AdminLeaderBoard")}
        />
        <NavIcon
          label="TimeTable"
          icon="calendar-outline"
          onPress={() => router.push("/Admin/AdminTimetable")}
        />
        <NavIcon
          label="Profile"
          icon="person-outline"
          onPress={() => router.push("/Admin/AdminProfile")}
        />
      </View>
    </View>
  );
}

function NavIcon({ label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={26} color="#fff" />
      <Text style={styles.navLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center", // centers the inner view
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 350, 
    backgroundColor: "#2d6eefff",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    alignSelf: "center", 
    marginBottom: 30,
  },
  navItem: { alignItems: "center" },
  navLabel: { fontSize: 12, color: "#fff", marginTop: 2 },
});

