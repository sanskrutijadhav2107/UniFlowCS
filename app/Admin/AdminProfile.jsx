import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import AdminNavbar from "./components/AdminNavbar";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>UniflowCS</Text>
        </View>

        {/* Profile Title */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Profile</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/921/921071.png" }} // replace with your image URL
            style={styles.avatar}
          />
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Name :</Text> Roshni Shaha
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Email :</Text> Roshni@gmail.com
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Phone :</Text> 860xxxxxxx
          </Text>
        </View>

        {/* Edit Button */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </ScrollView>

       {/* Bottom Navbar */}
                <AdminNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#146ED7",
    padding: 15,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  sectionTitle: {
    backgroundColor: "#F2E2C4",
    paddingVertical: 10,
    margin: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  sectionTitleText: { fontSize: 16, fontWeight: "bold" },
  avatarContainer: { alignItems: "center", marginTop: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  infoBox: {
    backgroundColor: "#E5E5E5",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 5,
    padding: 10,
  },
  infoText: { fontSize: 15 },
  infoLabel: { fontWeight: "bold" },
  editButton: {
    backgroundColor: "#146ED7",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 100,
  },
  editButtonText: { fontSize: 16, fontWeight: "bold", color: "#fff" },

});
