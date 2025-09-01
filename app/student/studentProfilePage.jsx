// app/student/StudentProfile.jsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function StudentProfile() {
  const router = useRouter();

  const openLinkedIn = () => {
    Linking.openURL("https://www.linkedin.com/in/your-linkedin-id"); // Replace with actual
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={["#146ED7", "#4A90E2"]} style={styles.header}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Sanskruti Jadhav</Text>
        <Text style={styles.subtitle}>Diploma in Computer Engineering</Text>
      </LinearGradient>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="id-card-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>PRN: 123456789</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>Semester: 4</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>Year: 2nd Year Diploma</Text>
        </View>
        {/* LinkedIn ID */}
        <TouchableOpacity style={styles.infoRow} onPress={openLinkedIn}>
          <FontAwesome name="linkedin-square" size={22} color="#0A66C2" />
          <Text style={[styles.infoText, { color: "#0A66C2", textDecorationLine: "underline" }]}>
            linkedin.com/in/sanskruti-jadhav
          </Text>
        </TouchableOpacity>
      </View>

      

      {/* Motivation Quote */}
      <View style={styles.quoteCard}>
        <Ionicons name="sparkles-outline" size={22} color="#FFD700" />
        <Text style={styles.quoteText}>
          “Believe you can and you’re halfway there.”
        </Text>
      </View>

      {/* Logout Button */}
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

