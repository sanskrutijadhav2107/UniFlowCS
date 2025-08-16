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

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>S</Text>
        </View>

        <Text style={styles.name}>Satish Nannavare</Text>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={18} color="#146ED7" />
          <Text style={styles.infoText}>satish@example.com</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={18} color="#146ED7" />
          <Text style={styles.infoText}>+1 234 567 890</Text>
        </View>
      </View>

      {/* Bottom Navigation (your requested structure) */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <NavIcon
            label="Home"
            icon="home-outline"
            onPress={() => router.push("/home")}
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
            onPress={() => router.push("/Faculty/FacultyProfile")}
          />
        </View>
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

  profileCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#A78BFA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  infoText: { fontSize: 16, marginLeft: 10, color: "#333" },

  bottomNavContainer: {
  position: "absolute",  // Stick it to the bottom
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
