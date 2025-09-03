import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import BottomNavbar from "./Components/BottomNavbar"; 

export default function Timetable() {
  const router = useRouter();

  // All 6 days
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Example timetable data
  const timetableData = {
    Mon: [
      { name: "DCN", time: "9:00 - 10:00", class: "SY" },
      { name: "OS", time: "10:15 - 11:15", class: "TY" },
    ],
    Tue: [
      { name: "Hardware Lab", time: "9:00 - 10:00", class: "FY" },
      { name: "DCN", time: "10:15 - 11:15", class: "SY" },
    ],
    Wed: [
      { name: "English", time: "9:00 - 10:00", class: "FY" },
      { name: "Economics", time: "10:15 - 11:15", class: "SY" },
    ],
    Thu: [
      { name: "Computer Science", time: "9:00 - 10:00", class: "TY" },
      { name: "Electronics", time: "10:15 - 11:15", class: "SY" },
    ],
    Fri: [
      { name: "Statistics", time: "9:00 - 10:00", class: "FY" },
      { name: "Environmental Science", time: "10:15 - 11:15", class: "TY" },
    ],
    Sat: [
      { name: "Workshop", time: "9:00 - 11:00", class: "ALL" },
    ],
  };

  const [selectedDay, setSelectedDay] = useState("Mon");

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

      {/* Days Row (Horizontal Scroll) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayRow}
      >
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayCircle,
              selectedDay === day ? styles.activeDay : styles.inactiveDay,
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={styles.dayText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Subjects */}
      <ScrollView contentContainerStyle={styles.subjectContainer}>
        {timetableData[selectedDay]?.map((sub, index) => (
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
      <BottomNavbar/>

      
    </View>
  );
}

// function NavIcon({ label, icon, onPress }) {
//   return (
//     <TouchableOpacity style={styles.navItem} onPress={onPress}>
//       <Ionicons name={icon} size={26} color="#fff" />
//       <Text style={styles.navLabel}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

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
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  dayCircle: {
    width: 87,
    height: 87,
    borderRadius: 43.5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  activeDay: {
    backgroundColor: "#146ED7",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  inactiveDay: {
    backgroundColor: "#afafafff",
  },
  dayText: { fontWeight: "bold", color: "#fff" },

  subjectContainer: { paddingHorizontal: 15, paddingBottom: 80 },
  subjectCard: {
    backgroundColor: "#EAF2FF",
    padding: 35,

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
  subjectName: { fontSize: 25, fontWeight: "bold", marginBottom: 8, color: "#146ED7" },
  subjectDetail: { fontSize: 17, color: "#333", marginBottom: 4 },
  bold: { fontWeight: "bold" },

  
});
