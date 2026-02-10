
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomNavbar from "./components/BottomNavbar";
import UniversalPostsFeed from "../../components/ui/UniversalPostsFeed";
import FeatureCard from "../../components/ui/FeatureCard";
import { Ionicons } from "@expo/vector-icons";


export default function FacultyHomePage() {
  const router = useRouter();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load faculty/profile from AsyncStorage on mount
  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        // primary key: "faculty"
        const raw = await AsyncStorage.getItem("faculty");
        if (raw) {
          if (mounted) setFaculty(JSON.parse(raw));
          return;
        }
        // fallback key: "currentUser"
        const raw2 = await AsyncStorage.getItem("currentUser");
        if (raw2 && mounted) setFaculty(JSON.parse(raw2));
      } catch (err) {
        console.warn("Could not load faculty profile from AsyncStorage", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadProfile();
    return () => (mounted = false);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2d6eefff" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const displayName = faculty?.name || "Shravan"; // fallback to your previous default
  // Build a subtitle using role, year, semester if available
  const parts = [];
  if (faculty?.role) parts.push(faculty.role === "admin" ? "Admin / Faculty" : faculty.role);
  if (faculty?.year) parts.push(`${faculty.year}rd Year`);
  if (faculty?.semester) parts.push(`Semester ${faculty.semester}`);
  const displaySubtitle = parts.length ? parts.join(" • ") : "Welcome";

  return (
    <View style={styles.container}>
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Page Title */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Hii ! {displayName}</Text>
          <Text style={styles.subTitle}>{displaySubtitle}</Text>
        </View>

        <View style={styles.grid}>
  <FeatureCard
    icon={<Ionicons name="cloud-upload-outline" size={28} color="#2d6eefff" />}
    title="Upload Notes"
    subtitle="Share study material"
    onPress={() => router.push("/Faculty/FacultyUploadNotes")}
  />

  <FeatureCard
    icon={<Ionicons name="document-text-outline" size={28} color="#2d6eefff" />}
    title="Notice"
    subtitle="Inform students"
    onPress={() => router.push("/Faculty/FacultyNotice")}
  />

  <FeatureCard
  icon={<Ionicons name="create-outline" size={28} color="#2d6eefff" />}
  title="Enter Marks"
  subtitle="Update student marks"
  onPress={() => router.push("/Faculty/enterMarks")}
/>

</View>


        <UniversalPostsFeed
  collectionName="posts"
  maxWidth={1280}
/>

      </ScrollView>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
  paddingVertical: 20,
},

  header: {
    width: "100%",
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#E3F0FF",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#146ED7",
  },
  subTitle: {
    fontSize: 14,
    color: "#146ED7",
    marginTop: 4,
  },
 grid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-around",
  marginVertical: 10,
},

  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postName: { fontWeight: "bold" },
  postSubtitle: { fontSize: 12, color: "#555" },
  postText: { marginVertical: 5 },
  postImage: { width: "100%", height: 150, borderRadius: 10, marginTop: 5 },
  postActions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
});