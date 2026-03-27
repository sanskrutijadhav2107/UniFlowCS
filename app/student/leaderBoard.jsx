// import { StyleSheet, View } from "react-native";
// import LeaderboardView from "../../components/LeaderboardView";
// import BottomNavbar from "./components/BottomNavbar";

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





import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import LeaderboardView from "../../components/LeaderboardView";
import BottomNavbar from "./components/BottomNavbar";

const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
};

export default function Leaderboard() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <LinearGradient 
        colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} 
        style={styles.header}
      >
        <View style={styles.statusSpacer} />
        {/* Decorative background icon for texture */}
        <MaterialCommunityIcons 
          name="trophy-variant-outline" 
          size={120} 
          color="rgba(255,255,255,0.1)" 
          style={styles.bgIcon} 
        />
        <Text style={styles.headerTitle}>Campus Leaderboard</Text>
        <Text style={styles.headerSub}>Celebrating the top Buzz contributors</Text>
      </LinearGradient>

      <View style={styles.content}>
        <LeaderboardView />
      </View>

      <BottomNavbar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingBottom: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    overflow: 'hidden',
  },
  bgIcon: { position: 'absolute', right: -20, top: 40 },
  statusSpacer: { height: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 60 },
  headerTitle: { color: 'white', fontSize: 26, fontWeight: '900', letterSpacing: 0.8 },
  headerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '500', marginTop: 5 },
  content: { flex: 1, marginTop: -35 },
});



