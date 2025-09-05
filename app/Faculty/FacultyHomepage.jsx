
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomNavbar from "./components/BottomNavbar";

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

        {/* Feature Buttons */}
        <View style={styles.buttonGrid}>
          <FeatureButton
            onPress={() => router.push("/Faculty/FacultyUploadNotes")}
            label="Upload Notes"
            icon="cloud-upload-outline"
          />
          <FeatureButton
            onPress={() => router.push("/Faculty/FacultyNotice")}
            label="Notice"
            icon="document-text-outline"
          />
        </View>

        {/* Feed Posts (kept as-is) */}
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
                style={styles.postAvatar}
              />
              <View>
                <Text style={styles.postName}>{displayName}</Text>
                <Text style={styles.postSubtitle}>
                  {faculty?.year ? `${faculty.year}rd Year Diploma Computer Engineering Student` : "3rd Year Diploma Computer Engineering Student"}
                </Text>
              </View>
            </View>
            <Text style={styles.postText}>
              I&apos;m thrilled to announce that I&apos;ve successfully completed not one, but two internships this summer...
            </Text>
            <Image
              source={{ uri: "https://i.ibb.co/FzYg2dV/certificate-sample.png" }}
              style={styles.postImage}
            />
            <View style={styles.postActions}>
              <Text>👍 Like</Text>
              <Text>💬 Comment</Text>
              <Text>📤 Share</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </View>
  );
}

function FeatureButton({ label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.featureButton} onPress={onPress}>
      <Ionicons name={icon} size={28} color="#fff" />
      <Text style={styles.featureText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    alignItems: "center",
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
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  featureButton: {
    width: 140,
    height: 80,
    backgroundColor: "#007BFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    borderWidth: 1,
    borderColor: "#0056b3",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  featureText: { color: "#fff", marginTop: 5, fontWeight: "bold" },
  postCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postName: { fontWeight: "bold" },
  postSubtitle: { fontSize: 12, color: "#555" },
  postText: { marginVertical: 5 },
  postImage: { width: "100%", height: 150, borderRadius: 10, marginTop: 5 },
  postActions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
});