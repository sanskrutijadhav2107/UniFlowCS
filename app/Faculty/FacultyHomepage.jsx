import {
  Feather,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// UI Components
import UniversalPostsFeed from "../../components/ui/UniversalPostsFeed";
import BottomNavbar from "./components/BottomNavbar";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TILE_WIDTH = (SCREEN_WIDTH - 60) / 3;

const COLORS = {
  primary: "#2D6EEF",
  primaryDark: "#1A50C8",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  success: "#10B981",
  cardShadow: "rgba(45, 110, 239, 0.12)",
};

// Consistent Animation Wrapper
function PressableCard({ children, style, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </TouchableOpacity>
  );
}

export default function FacultyHome() {
  const router = useRouter();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const raw = await AsyncStorage.getItem("faculty") || await AsyncStorage.getItem("currentUser");
      if (raw) setFaculty(JSON.parse(raw));
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) return (
    <View style={styles.loadingWrap}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  const FACULTY_TOOLS = [
    { title: "Upload", sub: "Notes", route: "/Faculty/FacultyUploadNotes", icon: "upload-cloud", color: "#2D6EEF", bg: "#EBF0FD" },
    { title: "Notice", sub: "Announce", route: "/Faculty/FacultyNotice", icon: "bell", color: "#8B5CF6", bg: "#F3EEFF" },
    { title: "Grading", sub: "Marks", route: "/Faculty/enterMarks", icon: "edit-3", color: "#10B981", bg: "#EDFAF3" },
    { title: "Schedule", sub: "Timing", route: "/Faculty/timetable", icon: "calendar", color: "#06B6D4", bg: "#E0F8FD" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadProfile(); }} tintColor={COLORS.primary} />}
      >
        {/* --- CONSISTENT HEADER --- */}
        <LinearGradient colors={[COLORS.primaryDark, COLORS.primary, "#60A5FA"]} style={styles.header}>
          <View style={styles.circleDeco} />
          <View style={styles.headerTop}>
            <View>
              <View style={styles.greetingRow}>
                <MaterialCommunityIcons name="briefcase-variant-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.greetingText}>Faculty Dashboard</Text>
              </View>
              <Text style={styles.userName}>Hii, {faculty?.name?.split(" ")[0] || "Professor"} 👋</Text>
            </View>
            
            <TouchableOpacity onPress={() => router.push("/Faculty/FacultyProfile")} style={styles.profileContainer}>
              <Image 
                source={{ uri: faculty?.photo || "https://ui-avatars.com/api/?name=" + faculty?.name }} 
                style={styles.avatar} 
              />
              <View style={styles.statusDot} />
            </TouchableOpacity>
          </View>
          <View style={styles.idChip}>
            <Text style={styles.idText}>{faculty?.role?.toUpperCase() || "FACULTY"} • UNIT-CS</Text>
          </View>
        </LinearGradient>

        {/* --- FACULTY TOOLS SECTION --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Academic Tools</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Overview</Text></TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {FACULTY_TOOLS.map((item, idx) => (
            <PressableCard key={idx} style={styles.featureCard} onPress={() => router.push(item.route)}>
              <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <Feather name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureSubtitle}>{item.sub}</Text>
            </PressableCard>
          ))}
        </View>

        {/* --- CAMPUS BUZZ --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>FACULTY VIEW</Text>
          </View>
        </View>
        
        <View style={styles.feedWrapper}>
          <UniversalPostsFeed collectionName="posts" maxWidth={SCREEN_WIDTH} />
        </View>
      </ScrollView>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 120 },
  
  // Header (Exact Match with Student/Admin)
  header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 25, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: "hidden" },
  circleDeco: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.1)", top: -50, right: -50 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greetingRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  greetingText: { color: "rgba(255,255,255,0.8)", fontSize: 11, marginLeft: 6, fontWeight: "700", textTransform: "uppercase" },
  userName: { color: COLORS.white, fontSize: 24, fontWeight: "800" },
  
  // Profile Photo Style
  profileContainer: { width: 60, height: 60, borderRadius: 30, padding: 3, backgroundColor: "rgba(255,255,255,0.3)" },
  avatar: { width: "100%", height: "100%", borderRadius: 30, backgroundColor: "#E2E8F0" },
  statusDot: { position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.primary },
  
  idChip: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 15 },
  idText: { color: COLORS.white, fontSize: 10, fontWeight: "800" },

  // Sections
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 25, marginTop: 30, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
  seeAll: { color: COLORS.primary, fontWeight: "700", fontSize: 14 },

  // Grid Layout
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, justifyContent: "space-between" },
  featureCard: { width: TILE_WIDTH, backgroundColor: COLORS.white, borderRadius: 20, padding: 15, marginBottom: 12, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  iconBox: { width: 45, height: 45, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  featureTitle: { fontSize: 12, fontWeight: "700", color: COLORS.textPrimary, textAlign: "center" },
  featureSubtitle: { fontSize: 9, color: COLORS.textMuted, marginTop: 2, textTransform: "uppercase", fontWeight: "700" },

  liveIndicator: { flexDirection: "row", alignItems: "center", backgroundColor: "#F0F9FF", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginRight: 5 },
  liveText: { fontSize: 10, fontWeight: "900", color: COLORS.primary },
  feedWrapper: { paddingHorizontal: 10 },
});