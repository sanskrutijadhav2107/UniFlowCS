import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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
import UniversalPostsFeed from "../../components/ui/UniversalPostsFeed";
import AdminNavbar from "./components/AdminNavbar";

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

// Animation Wrapper for Cards
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

export default function AdminHome() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAdmin();
  }, []);

  const loadAdmin = async () => {
    try {
      const rawAdmin = await AsyncStorage.getItem("admin") || await AsyncStorage.getItem("currentUser");
      if (rawAdmin) setAdmin(JSON.parse(rawAdmin));
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

  const ADMIN_TOOLS = [
    { title: "Faculty", sub: "Manage", route: "/Admin/manageFaculty", icon: "users", color: "#2D6EEF", bg: "#EBF0FD" },
    { title: "Monitor", sub: "Grades", route: "/Admin/AdminSubjectMonitor", icon: "activity", color: "#06B6D4", bg: "#E0F8FD" },
    { title: "Notice", sub: "Alerts", route: "/Admin/noticeBoard", icon: "megaphone", color: "#8B5CF6", bg: "#F3EEFF" },
    { title: "Reports", sub: "Grievance", route: "/Admin/adminGrievances", icon: "alert-circle", color: "#EF4444", bg: "#FEF2F2" },
    { title: "Careers", sub: "Job Post", route: "/Admin/addOpportunity", icon: "briefcase", color: "#F59E0B", bg: "#FFF8E6" },
    { title: "Settings", sub: "System", route: "/Admin/AdminProfile", icon: "settings", color: "#64748B", bg: "#F1F5F9" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadAdmin(); }} tintColor={COLORS.primary} />}
      >
        {/* --- CONSISTENT HEADER --- */}
        <LinearGradient colors={[COLORS.primaryDark, COLORS.primary, "#60A5FA"]} style={styles.header}>
          <View style={styles.circleDeco} />
          <View style={styles.headerTop}>
            <View>
              <View style={styles.greetingRow}>
                <MaterialCommunityIcons name="shield-check" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.greetingText}>Administrative Access</Text>
              </View>
              <Text style={styles.userName}>Hey, {admin?.name?.split(" ")[0] || "Admin"} 👋</Text>
            </View>
            
            {/* ALIGNED PROFILE PHOTO (Matches Student Home) */}
            <TouchableOpacity onPress={() => router.push("/Admin/AdminProfile")} style={styles.profileContainer}>
              <Image 
                source={{ uri: admin?.photo || "https://ui-avatars.com/api/?name=" + admin?.name }} 
                style={styles.avatar} 
              />
              <View style={styles.statusDot} />
            </TouchableOpacity>
          </View>
          <View style={styles.idChip}><Text style={styles.idText}>ROOT-ADMIN-2026</Text></View>
        </LinearGradient>

        {/* --- MANAGEMENT TOOLS SECTION --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Management Console</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Overview</Text></TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {ADMIN_TOOLS.map((item, idx) => (
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
          <Text style={styles.sectionTitle}>System Logs & Posts</Text>
          <View style={styles.liveIndicator}><View style={styles.liveDot} /><Text style={styles.liveText}>SYNCED</Text></View>
        </View>
        
        <View style={styles.feedWrapper}>
          <UniversalPostsFeed collectionName="posts" />
        </View>
      </ScrollView>

      <AdminNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 120 },
  
  // Header Style (Exact Student Match)
  header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 25, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: "hidden" },
  circleDeco: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.1)", top: -50, right: -50 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greetingRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  greetingText: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginLeft: 6, fontWeight: "600", textTransform: "uppercase" },
  userName: { color: COLORS.white, fontSize: 24, fontWeight: "800" },
  
  // Profile Aligned
  profileContainer: { width: 60, height: 60, borderRadius: 30, padding: 3, backgroundColor: "rgba(255,255,255,0.3)" },
  avatar: { width: "100%", height: "100%", borderRadius: 30, backgroundColor: "#E2E8F0" },
  statusDot: { position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.primary },
  
  idChip: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 15 },
  idText: { color: COLORS.white, fontSize: 10, fontWeight: "800" },

  // Section Styling
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 25, marginTop: 30, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
  seeAll: { color: COLORS.primary, fontWeight: "700", fontSize: 14 },

  // Modernized Grid (Matches Student Learning Tools but Admin Style)
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, justifyContent: "space-between" },
  featureCard: { width: TILE_WIDTH, backgroundColor: COLORS.white, borderRadius: 20, padding: 15, marginBottom: 12, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  iconBox: { width: 45, height: 45, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  featureTitle: { fontSize: 13, fontWeight: "700", color: COLORS.textPrimary, textAlign: "center" },
  featureSubtitle: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, textTransform: "uppercase", fontWeight: "600" },

  liveIndicator: { flexDirection: "row", alignItems: "center", backgroundColor: "#E0F2FE", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginRight: 5 },
  liveText: { fontSize: 10, fontWeight: "900", color: COLORS.primary },
  feedWrapper: { paddingHorizontal: 10 },
});