
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function NotesPage() {
  const router = useRouter();

  const notesData = [
    { 
      id: 1, 
      title: "Advance Java", 
      icon: <Ionicons name="logo-javascript" size={44} color="#146ED7" />, 
      units: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"]
    },
    { 
      id: 2, 
      title: "Data Analytics", 
      icon: <MaterialIcons name="analytics" size={44} color="#146ED7" />, 
      units: ["Intro to DA", "Data Cleaning", "Data Viz", "ML Basics", "Case Studies"]
    },
    { 
      id: 3, 
      title: "Software Eng", 
      icon: <FontAwesome5 name="project-diagram" size={40} color="#146ED7" />, 
      units: ["Unit 1", "Unit 2", "Unit 3", "Unit 4"]
    },
    { 
      id: 4, 
      title: "Operating System", 
      icon: <MaterialIcons name="computer" size={44} color="#146ED7" />, 
      units: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"]
    },
    { 
      id: 5, 
      title: "Entrepreneurship Development", 
      icon: <FontAwesome5 name="lightbulb" size={40} color="#146ED7" />, 
      units: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"]
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        <Text style={styles.header}>UniFlow CS</Text>

        <View style={styles.grid}>
          {notesData.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => router.push({
                pathname: "./components/notesTemplate",
                params: { subject: item.title, units: JSON.stringify(item.units) }
              })}
            >
              <View style={styles.iconCircle}>
                {item.icon}
              </View>
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
    alignItems: "center", margin: 12
  },
  iconCircle: {
    backgroundColor: "#fff", 
    width: 120, 
    height: 120, 
    borderRadius: 60,
    justifyContent: "center", 
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5
  },
  cardTitle: { fontSize: 13, textAlign: "center", fontWeight: "500", marginTop: 8 },

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
