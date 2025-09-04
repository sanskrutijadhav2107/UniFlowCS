import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import BottomNavbar from "./components/BottomNavbar";

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
    Sat: [{ name: "Workshop", time: "9:00 - 11:00", class: "ALL" }],
  };

  const [selectedDay, setSelectedDay] = useState("Mon");

  // Colors + icons for each day
  const dayStyles = [
    { color: "#4D96FF", icon: "book-outline" }, // Mon
    { color: "#4D96FF", icon: "desktop-outline" }, // Tue
    { color: "#4D96FF", icon: "school-outline" }, // Wed
    { color: "#4D96FF", icon: "laptop-outline" }, // Thu
    { color: "#4D96FF", icon: "stats-chart-outline" }, // Fri
    { color: "#4D96FF", icon: "school-outline" }, // Sat
  ];

  return (
    <View style={styles.container}>
      {/* Page Title */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Class Timetable</Text>
        <Text style={styles.subTitle}>Organize your schedule day by day</Text>
      </View>

      {/* Days Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayRow}
      >
        {days.map((day, index) => {
          const isActive = selectedDay === day;
          const { color, icon } = dayStyles[index];

          return (
            <TouchableOpacity
              key={day}
              style={styles.dayItem}
              onPress={() => setSelectedDay(day)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.dayCircle,
                  { backgroundColor: isActive ? color : "#E0E0E0" },
                ]}
              >
                <Ionicons
                  name={icon}
                  size={28}
                  color={isActive ? "#fff" : "#666"}
                />
              </View>
              <Text style={[styles.dayLabel, isActive && styles.activeDayLabel]}>
                {day}
              </Text>
              {isActive && <View style={styles.activeLine} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Subjects */}
      <ScrollView contentContainerStyle={styles.subjectContainer}>
        {timetableData[selectedDay]?.map((sub, index) => (
          <View key={index} style={styles.subjectCard}>
            {/* Header Bar */}
            <View style={styles.cardHeader}>
              <Ionicons name="book" size={22} color="#fff" />
              <Text style={styles.subjectName}>{sub.name}</Text>
            </View>

            {/* Details */}
            <View style={styles.cardBody}>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={20} color="#146ED7" />
                <Text style={styles.subjectDetail}>{sub.time}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="people-outline" size={20} color="#146ED7" />
                <Text style={styles.subjectDetail}>Class: {sub.class}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7FD", // subtle page background
  },

  // Header
  header: {
    paddingTop: 40,
    paddingBottom: 15,
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

  // Day Selector
  dayRow: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginVertical: 20,
    alignItems: "center",
  },
  dayItem: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  dayCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
   
  },
  activeDayLabel: {
    color: "#146ED7",
    fontWeight: "700",
  
  },
  activeLine: {
    height: 3,
    width: 32,
    backgroundColor: "#146ED7",
    borderRadius: 2,
    marginTop: 6,
  },

  // Subject Cards
  subjectContainer: { paddingHorizontal: 18, paddingBottom: 90 },
  subjectCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    overflow: "hidden", // important for rounded header
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#146ED7",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 10,
  },
  cardBody: {
    padding: 18,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  subjectDetail: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
});
