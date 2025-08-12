import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function NotesPage() {
  const notesData = [
    { id: 1, title: "Advance Java", icon: <Ionicons name="logo-javascript" size={40} color="#146ED7" /> },
    { id: 2, title: "Data Analytics", icon: <MaterialIcons name="analytics" size={40} color="#146ED7" /> },
    { id: 3, title: "Software Eng", icon: <FontAwesome5 name="project-diagram" size={36} color="#146ED7" /> },
    { id: 4, title: "Operating System", icon: <MaterialIcons name="computer" size={40} color="#146ED7" /> },
    { id: 5, title: "Entrepreneurship Development", icon: <FontAwesome5 name="lightbulb" size={36} color="#146ED7" /> },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        <Text style={styles.header}>UniFlow CS</Text>

        <View style={styles.grid}>
          {notesData.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card}>
              {item.icon}
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Rounded Bottom Navbar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity><Ionicons name="home" size={26} color="#146ED7" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="document-text" size={26} color="#146ED7" /></TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity><FontAwesome5 name="trophy" size={24} color="#146ED7" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="person" size={26} color="#146ED7" /></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D6EBFF" },
  header: { fontSize: 22, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginVertical: 15 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  card: {
    backgroundColor: "#fff", width: 130, height: 130, borderRadius: 100,
    justifyContent: "center", alignItems: "center", margin: 10,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3
  },
  cardTitle: { fontSize: 12, textAlign: "center", fontWeight: "500", marginTop: 5 },

  bottomNav: {
    flexDirection: "row", justifyContent: "space-around", alignItems: "center",
    backgroundColor: "#fff", position: "absolute", bottom: 15, left: 20, right: 20,
    borderRadius: 40, paddingVertical: 10,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 4
  },
  addButton: {
    backgroundColor: "#146ED7", width: 50, height: 50, borderRadius: 25,
    justifyContent: "center", alignItems: "center"
  }
});