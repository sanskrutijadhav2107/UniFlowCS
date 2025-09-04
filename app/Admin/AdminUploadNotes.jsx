import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import AdminNavbar from "./components/AdminNavbar";

export default function AdminUploadNotes() {
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
       {/* Page Title */}
                                    <View style={styles.header}>
                                      <Text style={styles.pageTitle}>Upload Notes</Text>
                                      <Text style={styles.subTitle}>Welcome</Text>
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
        <ScrollView contentContainerStyle={styles.unitsContainer}>
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
        </ScrollView>
        
      )}

        {/* Bottom Navbar */}
          <AdminNavbar />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
   // Header
  header: {
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
  // Subject Cards
  subjectList: {
    padding: 15,
    paddingBottom: 80,
  },
  subjectCard: {
    backgroundColor: "#146ED7",
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
  unitsContainer: { paddingHorizontal: 15, paddingBottom: 80 },
  unitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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

  
});
