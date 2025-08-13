import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router"; // for getting params in Expo Router

export default function NotesTemplate() {
  const { subject, units } = useLocalSearchParams(); // Get data from navigation
  const unitsList = JSON.parse(units); // Convert back to array

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>UniFlow CS</Text>
        <Text style={styles.subHeader}>{subject} Notes</Text>

        {unitsList.map((unit, index) => (
          <TouchableOpacity
            key={index}
            style={styles.unitCard}
            onPress={() => alert(`Opening ${unit}`)}
          >
            <Text style={styles.unitText}>{unit}</Text>
            <Ionicons name="eye" size={22} color="#146ED7" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navbar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity><Ionicons name="home" size={26} color="#146ED7" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="document-text" size={26} color="#146ED7" /></TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity><Ionicons name="trophy" size={24} color="#146ED7" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="person" size={26} color="#146ED7" /></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D6EBFF", padding: 15 },
  header: { fontSize: 20, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginBottom: 5 },
  subHeader: { fontSize: 16, color: "#000", textAlign: "center", marginBottom: 20 },

  unitCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  unitText: { fontSize: 16, fontWeight: "500", color: "#333" },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    borderRadius: 40,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  
  addButton: {
    backgroundColor: "#146ED7",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
