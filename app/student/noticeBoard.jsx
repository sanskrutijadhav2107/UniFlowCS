// app/student/notice-board.jsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function NoticeBoard() {
  const notices = [
    {
      id: 1,
      name: "Prof. Santosh Sabale",
      text: "All the students be there in class room sharp at 11 am today.",
    },
    {
      id: 2,
      name: "Prof. Siddesh Jadhav",
      text: "All the students submit the term work before 31st Aug.",
    },
    {
      id: 3,
      name: "Prof. Santosh Sabale",
      text: "There will be no lectures conducted tomorrow.",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* Header */}
        <Text style={styles.header}>UniFlow CS</Text>
        <Text style={styles.subHeader}>Announcements</Text>

        {/* Notices */}
        {notices.map((notice) => (
          <View key={notice.id} style={styles.noticeCard}>
            {/* Teacher Info */}
            <View style={styles.teacherRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{notice.name.charAt(6)}</Text>
              </View>
              <Text style={styles.teacherName}>{notice.name}</Text>
            </View>

            {/* Notice Text */}
            <View style={styles.noticeTextBox}>
              <Text style={styles.noticeText}>{notice.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navbar */}
      
            {/* Floating Rounded Bottom Navbar */}
            <View style={styles.bottomNav}>
              <TouchableOpacity><Ionicons name="home" size={28} color="#146ED7" /></TouchableOpacity>
              <TouchableOpacity><Ionicons name="document-text" size={28} color="#146ED7" /></TouchableOpacity>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={28} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity><FontAwesome5 name="trophy" size={28} color="#146ED7" /></TouchableOpacity>
              <TouchableOpacity><Ionicons name="person" size={28} color="#146ED7" /></TouchableOpacity>
            </View>
          </View>
        );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#B3D7FF" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0C2D57",
    textAlign: "center",
    marginTop: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0C2D57",
    textAlign: "center",
    marginVertical: 10,
  },
  noticeCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  avatar: {
    backgroundColor: "#00C2FF",
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  teacherName: { fontWeight: "600", fontSize: 14, color: "#0C2D57" },
  noticeTextBox: {
    backgroundColor: "#EFEFEF",
    borderRadius: 15,
    padding: 8,
    marginTop: 5,
  },
  noticeText: { fontSize: 13, color: "#333" },

  /* Bottom Navbar */
  bottomNav: {
    flexDirection: "row", justifyContent: "space-around", alignItems: "center",
    backgroundColor: "#fff", position: "absolute", bottom: 15, left: 20, right: 20,
    borderRadius: 40, paddingVertical: 10,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 4
  },

addButton: {
    backgroundColor: "#146ED7", width: 50, height: 50, borderRadius: 25,
    justifyContent: "center", alignItems: "center", shadowColor: "#000",
    shadowOpacity: 0.15, shadowRadius: 5, elevation: 4
  }
});
