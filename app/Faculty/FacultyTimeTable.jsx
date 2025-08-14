import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function Timetable() {
  const router = useRouter();

  const days = [
    { label: "Su", color: "#4CAF50" },
    { label: "M", color: "#FFC107" },
    { label: "Tu", color: "#F44336" },
    { label: "W", color: "#2196F3" },
  ];

  const subjects = [
    { name: "Subject", time: "hh:mm to hh:mm", class: "FY/SY/TY" },
    { name: "Subject", time: "hh:mm to hh:mm", class: "FY/SY/TY" },
    { name: "Subject", time: "hh:mm to hh:mm", class: "FY/SY/TY" },
  ];

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

      {/* Days */}
      <View style={styles.dayRow}>
        {days.map((day) => (
          <View key={day.label} style={[styles.dayCircle, { backgroundColor: day.color }]}>
            <Text style={styles.dayText}>{day.label}</Text>
          </View>
        ))}
      </View>

      {/* Subjects */}
      <ScrollView contentContainerStyle={styles.subjectContainer}>
        {subjects.map((sub, index) => (
          <View key={index} style={styles.subjectCard}>
            <Text style={styles.subjectName}>{sub.name}</Text>
            <Text style={styles.subjectDetail}>
              <Text style={styles.bold}>Time:</Text> {sub.time}
            </Text>
            <Text style={styles.subjectDetail}>
              <Text style={styles.bold}>Class:</Text> {sub.class}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavIcon label="Notes" icon="create-outline" onPress={() => router.push("/notes")} />
        <NavIcon label="Timetable" icon="grid-outline" onPress={() => router.push("/timetable")} />
        <NavIcon label="Post" icon="add-circle-outline" onPress={() => router.push("/post")} />
        <NavIcon label="Notice" icon="document-text-outline" onPress={() => router.push("/notice")} />
        <NavIcon label="You" icon="person-circle-outline" onPress={() => router.push("/profile")} />
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

  dayRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  dayCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  dayText: { fontWeight: "bold", color: "#fff" },

  subjectContainer: { paddingHorizontal: 15, paddingBottom: 80 },
  subjectCard: {
    backgroundColor: "#EAF2FF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d0e0ff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  subjectName: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#146ED7" },
  subjectDetail: { fontSize: 14, color: "#333", marginBottom: 4 },
  bold: { fontWeight: "bold" },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#146ED7",
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  navItem: { alignItems: "center" },
  navLabel: { fontSize: 12, color: "#fff", marginTop: 2 },
});
