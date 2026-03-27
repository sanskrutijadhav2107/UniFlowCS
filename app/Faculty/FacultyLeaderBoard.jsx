// import React from "react";
// import { View, StyleSheet } from "react-native";
// import BottomNavbar from "./components/BottomNavbar";
// import LeaderboardView from "../../components/LeaderboardView";

// export default function Leaderboard() {
//   return (
//     <View style={styles.container}>
//       <LeaderboardView />
//       <BottomNavbar active="home" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FBFF",
//   },
// });






import { LinearGradient } from "expo-linear-gradient";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import LeaderboardView from "../../components/LeaderboardView";
import BottomNavbar from "./components/BottomNavbar";

const COLORS = {
  primary: "#2D6EEF",
  secondary: "#1A50C8",
  bg: "#F8FAFF",
  white: "#FFFFFF",
};

export default function Leaderboard() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* BRANDED HEADER */}
      <LinearGradient 
        colors={[COLORS.secondary, COLORS.primary]} 
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSub}>Top Academic Performers</Text>
      </LinearGradient>

      {/* LEADERBOARD CONTENT */}
      <View style={styles.content}>
        <LeaderboardView />
      </View>

      {/* SPACING FOR NAVBAR */}
      <View style={{ height: 70 }} />
      <BottomNavbar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "white",
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    marginTop: 4,
  },
  content: {
    flex: 1,
    marginTop: -20, // Pulls the leaderboard list slightly into the header for a modern look
  },
});