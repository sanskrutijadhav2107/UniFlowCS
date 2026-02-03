

// app/student/StudentHome.jsx
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "./components/BottomNavbar";

import UniversalPostComposer from "../../components/ui/UniversalPostsFeed";
export default function StudentHome() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likes, setLikes] = useState(0);

  // Helper: normalize semester/year values to integers when possible
  const parseMaybeInt = (val) => {
    if (val == null) return null;
    if (typeof val === "number") return val;
    // try extract first number
    const m = String(val).match(/\d+/);
    return m ? Number(m[0]) : null;
  };

  const loadStudent = useCallback(async () => {
    try {
      setLoading(true);
      const saved = await AsyncStorage.getItem("student"); // <-- uses "student" key
      if (!saved) {
        // nothing saved — go to login
        Alert.alert("Not signed in", "Please login first.");
        router.replace("/student/login");
        return;
      }

      const parsed = JSON.parse(saved);

      // normalize fields
      const normalized = {
        ...parsed,
        prn: parsed.prn ?? parsed.id ?? parsed.PRN ?? null,
        name: parsed.name ?? parsed.fullName ?? parsed.displayName ?? "Student",
        year: parseMaybeInt(parsed.year),
        semester: parseMaybeInt(parsed.semester),
      };

      setStudent(normalized);
    } catch (err) {
      console.error("Load student error:", err);
      Alert.alert("Error", "Could not load user data. Please login again.");
      router.replace("/student/login");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadStudent();
  }, [loadStudent]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("student");
    setStudent(null);
    router.push("/student/login");
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#2d6eefff" />
        <Text style={{ marginTop: 10 }}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Greeting + profile */}
        <View style={styles.gpaCard}>
          <Image
            source={{
              uri: student?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hi {student?.name || "Student"}!</Text>
            <View style={styles.gpaBar}>
              <View style={styles.gpaFill}></View>
            </View>
            <Text style={styles.gpaText}>PRN: {student?.prn ?? "—"}</Text>
            <Text style={styles.gpaText}>Year: {student?.year ?? "—"}</Text>
            <Text style={styles.gpaText}>Semester: {student?.semester ?? "—"}</Text>
          </View>
        </View>

        {/* Feature Grid */}
        <View style={styles.grid}>
          <FeatureCard
            icon={<MaterialIcons name="menu-book" size={28} color="#2d6eefff" />}
            title="Notes"
            subtitle="Learn anytime"
            onPress={() => router.push("/student/notes")}
          />
          <FeatureCard
            icon={<Ionicons name="notifications" size={28} color="#2d6eefff" />}
            title="Notice Board"
            subtitle="Stay Updated"
            onPress={() => router.push("/student/noticeBoard")}
          />
          <FeatureCard
            icon={<Ionicons name="calendar" size={28} color="#2d6eefff" />}
            title="TimeTable"
            subtitle="Know what's next"
            onPress={() => router.push("/student/timetable")}
          />
          <FeatureCard
            icon={<Ionicons name="stats-chart" size={28} color="#2d6eefff" />}
            title="Dashboard"
            subtitle="Track your progress"
            onPress={() => router.push("/student/AcademicDashboard")}
          />
          <FeatureCard
            icon={<FontAwesome5 name="trophy" size={28} color="#2d6eefff" />}
            title="Leaderboard"
            subtitle="Be the best"
            onPress={() => router.push("/student/leaderBoard")}
          />
          <FeatureCard
            icon={<MaterialIcons name="work" size={28} color="#2d6eefff" />}
            title="Project"
            subtitle="Build success"
            onPress={() => router.push("/student/projectManagement")}
          />
          <FeatureCard
            icon={<MaterialIcons name="store" size={28} color="#2d6eefff" />}
            title="Marketplace"
            subtitle="Buy & Sell study items"
            onPress={() => router.push("/student/marketplace")}
          />
                    
        </View>

        {/* Post Card */}
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <Image
              source={{ uri: student?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
              style={styles.postAvatar}
            />
            <View>
              <Text style={styles.postName}>{student?.name || "Student"}</Text>
              <Text style={styles.postSubtitle}>
                {student?.year ? `${student.year} Year` : ""} Computer Engineering Student
              </Text>
            </View>
          </View>
          <Text style={styles.postText}>
            Excited to be part of UniFlow 🚀! Let&apos;s learn and grow together.
          </Text>
          <Image
            source={{ uri: "https://i.ibb.co/FzYg2dV/certificate-sample.png" }}
            style={styles.postImage}
          />
          <View style={styles.postActions}>
            <TouchableOpacity onPress={() => setLikes((l) => l + 1)}>
              <Text>👍 Like ({likes})</Text>
            </TouchableOpacity>
            <Text>💬 Comment</Text>
            <Text>📤 Share</Text>
          </View>
        </View>

        {/* Logout quick button */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navbar */}
      <BottomNavbar active="home" />
    </View>
  );
}

function FeatureCard({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
      {icon}
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FBFF" },

  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },

  gpaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    padding: 12,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  greeting: { fontSize: 16, fontWeight: "bold" },
  gpaBar: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginTop: 5,
    width: "80%",
  },
  gpaFill: { height: 10, backgroundColor: "#2d6eefff", borderRadius: 5, width: "79%" },
  gpaText: { marginTop: 5, fontSize: 12, fontWeight: "700" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  featureCard: {
    width: "40%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  featureTitle: { fontWeight: "bold", marginTop: 5 },
  featureSubtitle: { fontSize: 12, color: "#555", textAlign: "center" },

  postCard: {
    backgroundColor: "#fff",
    padding: 12,
    margin: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postName: { fontWeight: "bold" },
  postSubtitle: { fontSize: 12, color: "#555" },
  postText: { marginVertical: 5 },
  postImage: { width: "100%", height: 150, borderRadius: 10, marginTop: 5 },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },

  logoutBtn: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  logoutText: { color: "#146ED7", fontWeight: "700" },
});