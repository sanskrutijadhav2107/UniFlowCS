import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
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
import { db } from "../../firebase";
import AdminNavbar from "./components/AdminNavbar";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TILE_WIDTH = (SCREEN_WIDTH - 60) / 3;

const COLORS = {
  primary: "#2D6EEF",
  primaryDark: "#1A50C8",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textPrimary: "#0F172A",
  textMuted: "#94A3B8",
  success: "#10B981",
};

export default function AdminHome() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadAdmin();
    }, [])
  );

  const loadAdmin = async () => {
  const ADMIN_DOC_ID = "hhB1QTfOA2VVH6zxSMvR"; // Match the profile ID
  try {
    const saved = await AsyncStorage.getItem("admin");
    if (saved) {
      const localData = JSON.parse(saved);
      setAdmin(localData);

      // Background cloud sync
      const docSnap = await getDoc(doc(db, "admin", ADMIN_DOC_ID));
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        const combined = { ...localData, ...cloudData };
        setAdmin(combined);
        await AsyncStorage.setItem("admin", JSON.stringify(combined));
      }
    }
  } catch (err) { console.warn(err); }
  finally { setLoading(false); }
};

  if (loading) return <View style={styles.loadingWrap}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  const ADMIN_TOOLS = [
    { title: "Faculty", sub: "Manage", route: "/Admin/manageFaculty", icon: "users", color: "#2D6EEF", bg: "#EBF0FD" },
    { title: "Monitor", sub: "Grades", route: "/Admin/AdminSubjectMonitor", icon: "activity", color: "#06B6D4", bg: "#E0F8FD" },
    { title: "Notice", sub: "Alerts", route: "/Admin/noticeBoard", icon: "bell", color: "#8B5CF6", bg: "#F3EEFF" }, // ✅ Fixed icon
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadAdmin} tintColor={COLORS.primary} />}
      >
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
            
            <TouchableOpacity onPress={() => router.push("/Admin/AdminProfile")} style={styles.profileContainer}>
              <Image 
                source={{ uri: admin?.photo || "https://ui-avatars.com/api/?name=" + (admin?.name || 'Admin') }} 
                style={styles.avatar} 
              />
              <View style={styles.statusDot} />
            </TouchableOpacity>
          </View>
          <View style={styles.idChip}><Text style={styles.idText}>ROOT-ADMIN-2026</Text></View>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Management Console</Text>
        </View>

        <View style={styles.grid}>
          {ADMIN_TOOLS.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.featureCard} onPress={() => router.push(item.route)}>
              <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <Feather name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureSubtitle}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.feedWrapper}>
          <UniversalPostsFeed collectionName="posts" />
        </View>
      </ScrollView>
      <AdminNavbar />
    </View>
  );
}

// ... styles same as before
     



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 120 },
  header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 25, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: "hidden" },
  circleDeco: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.1)", top: -50, right: -50 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greetingRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  greetingText: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginLeft: 6, fontWeight: "600", textTransform: "uppercase" },
  userName: { color: COLORS.white, fontSize: 24, fontWeight: "800" },
  profileContainer: { width: 60, height: 60, borderRadius: 30, padding: 3, backgroundColor: "rgba(255,255,255,0.3)" },
  avatar: { width: "100%", height: "100%", borderRadius: 30, backgroundColor: "#E2E8F0" },
  statusDot: { position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.primary },
  idChip: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 15 },
  idText: { color: COLORS.white, fontSize: 10, fontWeight: "800" },
  sectionHeader: { marginHorizontal: 25, marginTop: 30, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, justifyContent: "space-between" },
  featureCard: { width: TILE_WIDTH, backgroundColor: COLORS.white, borderRadius: 20, padding: 15, marginBottom: 12, alignItems: "center", elevation: 2 },
  iconBox: { width: 45, height: 45, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  featureTitle: { fontSize: 13, fontWeight: "700", color: COLORS.textPrimary, textAlign: "center" },
  featureSubtitle: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, textTransform: "uppercase", fontWeight: "600" },
  feedWrapper: { paddingHorizontal: 10 },
});

