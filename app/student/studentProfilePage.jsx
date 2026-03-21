import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function StudentProfile() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load student data
  useEffect(() => {
    const loadStudent = async () => {
      try {
        const saved = await AsyncStorage.getItem("student");
        if (saved) {
          setStudent(JSON.parse(saved));
        }
      } catch (err) {
        console.log("Error loading student:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, []);

  // 🔹 Loading state
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#146ED7" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  // 🔹 Safe fallbacks
  const name = student?.name || "Student";
  const prn = student?.prn || "N/A";
  const semester = student?.semester || "-";
  const year = student?.year || "-";
  const branch = student?.branch || "Computer Engineering";
  const linkedin = student?.linkedin || null;

  const openLinkedIn = () => {
    if (linkedin) Linking.openURL(linkedin);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#146ED7", "#4A90E2"]} style={styles.header}>
        <Image
          source={{
            uri:
              student?.photo ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtitle}>{branch}</Text>
      </LinearGradient>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="id-card-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>PRN: {prn}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>Semester: {semester}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>Year: {year}</Text>
        </View>

        {/* LinkedIn */}
        {linkedin && (
          <TouchableOpacity style={styles.infoRow} onPress={openLinkedIn}>
            <FontAwesome name="linkedin-square" size={22} color="#0A66C2" />
            <Text style={[styles.infoText, styles.link]}>
              View LinkedIn Profile
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quote */}
      <View style={styles.quoteCard}>
        <Ionicons name="sparkles-outline" size={22} color="#FFD700" />
        <Text style={styles.quoteText}>
          “Consistency beats motivation. Keep going.”
        </Text>
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/")}
      >
        <LinearGradient
          colors={["#E63946", "#FF6B6B"]}
          style={styles.logoutGradient}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },

  // Header with gradient
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#e6e6e6", marginTop: 4 },

  // Info Card
  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    marginBottom: 15,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  infoText: { fontSize: 16, marginLeft: 10, color: "#333" },

  
  // Quote Card
  quoteCard: {
    backgroundColor: "#fff8e1",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    marginBottom: 30,
  },
  quoteText: { fontSize: 14, marginLeft: 10, color: "#333", fontStyle: "italic" },

  // Logout Button
  logoutButton: { alignItems: "center" },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 8 },
});

