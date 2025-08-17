import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Uniflow-CS</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Top Section */}
      <View style={styles.topSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>S</Text>
        </View>
        <Text style={styles.name}>Satish Nannavare</Text>
        <Text style={styles.subtitle}>Assistant Professor</Text>
      </View>

      {/* Profile Details */}
      <View style={styles.detailsSection}>
        <ProfileRow icon="school-outline" label="Education" value="M.Tech Computer Science" />
        <ProfileRow icon="book-outline" label="Subject" value="HTML, OOP, Microprocessor" />
        <ProfileRow icon="call-outline" label="Phone" value="+91 234 567 890" />
        <ProfileRow icon="mail-outline" label="Email" value="satish@example.com" />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <NavIcon
            label="Home"
            icon="home-outline"
            onPress={() => router.push("/Faculty/FacultyHomepage")}
          />
          <NavIcon
            label="Upload Notes"
            icon="cloud-upload-outline"
            onPress={() => router.push("/Faculty/FacultyUploadNotes")}
          />
          <NavIcon
            label="Ranking"
            icon="trophy-outline"
            onPress={() => router.push("/Faculty/FacultyLeaderBoard")}
          />
          <NavIcon
            label="TimeTable"
            icon="calendar-outline"
            onPress={() => router.push("/Faculty/FacultyTimeTable")}
          />
          <NavIcon
            label="Profile"
            icon="person-outline"
          />
        </View>
      </View>
    </View>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color="#146ED7" />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function NavIcon({ label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons name={icon} size={26} color="#fff" />
      <Text style={styles.navLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#146ED7",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  topSection: {
    alignItems: "center",
    paddingVertical: 25,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#A78BFA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: { color: "#fff", fontSize: 40, fontWeight: "bold" },
  name: { fontSize: 22, fontWeight: "bold", color: "#222" },
  subtitle: { fontSize: 15, color: "#555", marginTop: 4 },

  detailsSection: {
    backgroundColor: "#fff",
    marginTop: 15,
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  infoLabel: { fontSize: 13, color: "#777" },
  infoValue: { fontSize: 16, fontWeight: "500", color: "#222" },

  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    backgroundColor: "#2d6eefff",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  navItem: { alignItems: "center" },
  navLabel: { fontSize: 12, color: "#fff", marginTop: 2 },
});
