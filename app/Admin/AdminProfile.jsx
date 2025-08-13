import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

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
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home" size={26} color="#146ED7" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="document-text" size={26} color="#146ED7" />
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <View style={styles.addIconButton}>
            <Ionicons name="add" size={28} color="#146ED7" />
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity>
          <FontAwesome5 name="trophy" size={26} color="#146ED7" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={26} color="#146ED7" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#B8E6F2",
    padding: 15,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#000" },
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
    backgroundColor: "#B8E6F2",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 100,
  },
  editButtonText: { fontSize: 16, fontWeight: "bold" },
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
  addIconButton: {
    backgroundColor: "#146ED7",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
