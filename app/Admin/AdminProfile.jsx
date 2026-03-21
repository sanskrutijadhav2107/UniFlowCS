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

export default function AdminProfile() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load admin data
  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const data = await AsyncStorage.getItem("admin");

        if (data) {
          setAdmin(JSON.parse(data));
        } else {
          // fallback (in case you used another key)
          const alt = await AsyncStorage.getItem("currentUser");
          if (alt) setAdmin(JSON.parse(alt));
        }
      } catch (err) {
        console.log("Error loading admin:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, []);

  // 🔹 Loading UI
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#146ED7" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  // 🔹 Safe values
  const name = admin?.name || "Admin";
  const email = admin?.email || "N/A";
  const education = admin?.education || "Not specified";
  const phone = admin?.phone || "N/A";
  const linkedin = admin?.linkedin || null;

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
              admin?.photo ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtitle}>Admin - UniFlow CS</Text>
      </LinearGradient>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>Name: {name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>Email: {email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>Education: {education}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>Phone: {phone}</Text>
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

  // Header
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









