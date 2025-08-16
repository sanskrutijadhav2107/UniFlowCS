import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

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
      <Text style={styles.title}> Monitor Subject Progress</Text>

      {/* Subject Cards */}
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.teacher}>{item.teacher}</Text>

            {/* Progress bar */}
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Ionicons
          name="home"
          size={26}
          color="#146ED7"
          onPress={() => router.push("/Admin/AdminHome")}
        />
        <Ionicons
          name="document-text"
          size={26}
          color="#146ED7"
          onPress={() => router.push("/Admin/noticeBoard")}
        />
        <FontAwesome5
          name="trophy"
          size={26}
          color="#146ED7"
          onPress={() => alert("Achievements Clicked")}
        />
        <Ionicons
          name="person-circle-outline"
          size={26}
          color="#146ED7"
          onPress={() => router.push("/Admin/AdminProfile")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 15 },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 30,
    color: "#004AAD",
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#E6F0FA",
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 30,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
