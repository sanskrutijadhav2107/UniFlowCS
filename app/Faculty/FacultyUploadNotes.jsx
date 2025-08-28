import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function UploadNotes() {
  const router = useRouter();

  // Subjects list
  const subjects = ["DCN", "PP", "OOP", "DT"];

  // Track currently selected subject
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Track units state for each subject (lock/unlock)
  const [subjectUnits, setSubjectUnits] = useState({
    DCN: Array(6).fill("Locked"),
    PP: Array(6).fill("Locked"),
    OOP: Array(6).fill("Locked"),
    DT: Array(6).fill("Locked"),
  });

  // Toggle lock/unlock for a unit
  const toggleUnit = (subject, index) => {
    setSubjectUnits((prev) => {
      const updated = { ...prev };
      updated[subject][index] =
        updated[subject][index] === "Locked" ? "Unlocked" : "Locked";
      return updated;
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            selectedSubject ? setSelectedSubject(null) : router.back()
          }
        >
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Uniflow-CS</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Show Subjects if none selected */}
      {!selectedSubject ? (
        <ScrollView contentContainerStyle={styles.subjectList}>
          {subjects.map((sub) => (
            <TouchableOpacity
              key={sub}
              style={styles.subjectCard}
              onPress={() => setSelectedSubject(sub)}
            >
              <Text style={styles.subjectCardText}>{sub}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        // Show Units for selected subject
        <View style={styles.unitsContainer}>
          {subjectUnits[selectedSubject].map((status, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.unitRow}
              onPress={() => toggleUnit(selectedSubject, idx)}
            >
              <Text style={styles.unitText}>Unit {idx + 1}</Text>
              <View
                style={[
                  styles.unitStatus,
                  status === "Unlocked" ? styles.unlocked : styles.locked,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === "Unlocked" ? styles.unlockedText : styles.lockedText,
                  ]}
                >
                  {status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <NavIcon
            label="Home"
            icon="home-outline"
            onPress={() => router.push("/Faculty/FacultyHomepage")}
          />
          <NavIcon label="Upload Notes" icon="cloud-upload-outline" />
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
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  // Subject Cards
  subjectList: {
    padding: 15,
    paddingBottom: 80,
  },
  subjectCard: {
    backgroundColor: "#0056b3",
    borderRadius: 12,
    paddingVertical: 30,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  subjectCardText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

  // Units Section
  unitsContainer: {
    flex: 1,
    justifyContent: "space-between", // spread all 6 equally
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  unitRow: {
    flex: 1, // equal height for each unit
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  unitText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  unitStatus: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  unlocked: { backgroundColor: "#D4F5E4" },
  locked: { backgroundColor: "#FADAD8" },
  statusText: { fontWeight: "bold", fontSize: 12 },
  unlockedText: { color: "#28A745" },
  lockedText: { color: "#DC3545" },

  // Bottom Navbar
  bottomNavContainer: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
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
  navLabel: { fontSize: 12, color: "#fff" },
});