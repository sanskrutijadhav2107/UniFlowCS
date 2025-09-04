// app/Admin/AdminSubjectMonitor.jsx
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AdminNavbar from "./components/AdminNavbar";

// Sample Data
const subjects = [
  { id: "1", subject: "Python", teacher: "Prof. Sharma", completedUnits: 5 },
  { id: "2", subject: "DCN", teacher: "Dr. Patel", completedUnits: 5 },
  { id: "3", subject: "DT", teacher: "Prof. Mehta", completedUnits: 4 },
  { id: "4", subject: "OOP", teacher: "Dr. Singh", completedUnits: 6 },
];

export default function AdminSubjectMonitor() {
  return (
    <View style={styles.container}>
      {/* Title */}
      {/* Page Title */}
                           <View style={styles.header}>
                             <Text style={styles.pageTitle}>Subject Progress</Text>
                             <Text style={styles.subTitle}>Welcome</Text>
                           </View>

      {/* Subject List */}
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }} // space for navbar
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.teacher}>{item.teacher}</Text>

            {/* Progress Bar */}
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(item.completedUnits / 6) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {item.completedUnits} / 6 Units Completed
            </Text>
          </View>
        )}
      />

      {/* Bottom Navbar */}
      <AdminNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", paddingHorizontal: 15 },
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  subject: { fontSize: 16, fontWeight: "bold", color: "#146ED7" },
  teacher: { fontSize: 14, color: "#555", marginBottom: 8 },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#146ED7",
  },
  progressText: {
    fontSize: 12,
    color: "#333",
    marginTop: 5,
    fontWeight: "500",
  },
});
