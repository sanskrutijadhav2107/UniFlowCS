import React from "react";
import { View, StyleSheet } from "react-native";
import AdminNavbar from "./components/AdminNavbar";
import LeaderboardView from "../../components/LeaderboardView";

export default function Leaderboard() {
  return (
    <View style={styles.container}>
      <LeaderboardView />
      <AdminNavbar active="home" />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFF",
  },
});
