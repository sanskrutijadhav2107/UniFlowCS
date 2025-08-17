import React, { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import AdminNavbar from "./components/AdminNavbar";

export default function ManageFaculty() {
  const [search, setSearch] = useState("");
  const facultyData = [
    {
      id: 1,
      name: "Prachi Wadwal",
      phone: "879xxxxxxxx",
      education: "Btech",
      password: "1234",
      image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
    },
    {
      id: 2,
      name: "Prachi Wadwal",
      phone: "879xxxxxxxx",
      education: "Btech",
      password: "1234",
      image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>UniflowCS</Text>
        </View>

        {/* Manage Faculty Button */}
        <TouchableOpacity style={styles.manageButton}
           onPress={() => router.push("/Admin/EditFaculty")}>
          <Text style={styles.manageButtonText}>Manage Faculty</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
        />

        {/* Faculty Cards */}
        {facultyData.map((faculty) => (
          <View key={faculty.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image source={{ uri: faculty.image }} style={styles.avatar} />
              <Text style={styles.name}>{faculty.name}</Text>
            </View>
            <Text style={styles.info}>
              Phone no.: {faculty.phone}
            </Text>
            <Text style={styles.info}>
              Education: {faculty.education}
            </Text>
            <Text style={styles.info}>
              Password: {faculty.password}
            </Text>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.editButton}
                onPress={() => router.push("/Admin/EditFaculty")} >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeButton}>
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

     

      {/* Bottom Navbar */}
            <AdminNavbar />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    backgroundColor: "#B8D8FF",
    padding: 15,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#004AAD" },
  manageButton: {
    backgroundColor: "#F0E1B8",
    margin: 15,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  manageButtonText: { fontSize: 16, fontWeight: "500" },
  searchBar: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  name: { fontWeight: "bold", fontSize: 16 },
  info: { fontSize: 14, color: "#333", marginBottom: 3 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#B8D8FF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButton: {
    backgroundColor: "#ccc",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: { fontWeight: "600", fontSize: 14 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#E6F0FA",
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 30,
  },
  addButton: {
    backgroundColor: "#0A4D8C",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
