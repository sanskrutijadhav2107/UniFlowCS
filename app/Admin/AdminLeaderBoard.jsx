// import React from "react";
// import { View, StyleSheet } from "react-native";
// import AdminNavbar from "./components/AdminNavbar";
// import LeaderboardView from "../../components/LeaderboardView";

// export default function Leaderboard() {
//   return (
//     <View style={styles.container}>
//       <LeaderboardView />
//       <AdminNavbar active="home" />
//     </View>
    
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FBFF",
//   },
// });








import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import LeaderboardView from "../../components/LeaderboardView";

; 

// OR if all navbars are in a central components folder

const COLORS = {
  primary: "#2D6EEF",
  secondary: "#1A50C8",
  accent: "#FFD700",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textSub: "#64748B",
};

export default function Leaderboard() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* 🎓 FACULTY BRANDED HEADER */}
      <LinearGradient 
        colors={[COLORS.secondary, COLORS.primary]} 
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Student Rankings</Text>
              <Text style={styles.headerSub}>Academic Excellence 2025-26</Text>
            </View>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="medal-outline" size={32} color="white" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* 🏆 LEADERBOARD AREA */}
      <View style={styles.listWrapper}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="star-face" size={20} color={COLORS.accent} />
            <Text style={styles.infoText}>TOP PERFORMERS LIST</Text>
          </View>
          <Text style={styles.dateText}>Updated Just Now</Text>
        </View>
        
        <View style={styles.viewContainer}>
          <LeaderboardView />
        </View>
      </View>

      {/* SPACING & NAVIGATION */}
      <View style={{ height: 85 }} />
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
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 45,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 12,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "white",
    letterSpacing: 0.4,
  },
  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    marginTop: 2,
  },
  iconCircle: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: 12,
    borderRadius: 22,
  },
  listWrapper: {
    flex: 1,
    marginTop: -30,
    paddingHorizontal: 20,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 22,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textSub,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
  },
  viewContainer: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: 'transparent',
  }
});