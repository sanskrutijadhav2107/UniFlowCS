// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useRouter } from "expo-router";
// import BottomNavbar from "./components/BottomNavbar"; 

// export default function Profile() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back-outline" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Uniflow-CS</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Profile Top Section */}
//       <View style={styles.topSection}>
//         <View style={styles.avatarCircle}>
//           <Text style={styles.avatarText}>S</Text>
//         </View>
//         <Text style={styles.name}>Satish Nannavare</Text>
//         <Text style={styles.subtitle}>Assistant Professor</Text>
//       </View>

//       {/* Profile Details */}
//       <View style={styles.detailsSection}>
//         <ProfileRow icon="school-outline" label="Education" value="M.Tech Computer Science" />
//         <ProfileRow icon="book-outline" label="Subject" value="HTML, OOP, Microprocessor" />
//         <ProfileRow icon="call-outline" label="Phone" value="+91 234 567 890" />
//         <ProfileRow icon="mail-outline" label="Email" value="satish@example.com" />
//       </View>

//       <BottomNavbar/>
//     </View>
//   );
// }

// function ProfileRow({ icon, label, value }) {
//   return (
//     <View style={styles.infoRow}>
//       <Ionicons name={icon} size={20} color="#146ED7" />
//       <View style={{ marginLeft: 12 }}>
//         <Text style={styles.infoLabel}>{label}</Text>
//         <Text style={styles.infoValue}>{value}</Text>
//       </View>
//     </View>
//   );
// }

// function NavIcon({ label, icon, onPress }) {
//   return (
//     <TouchableOpacity style={styles.navItem} onPress={onPress}>
//       <Ionicons name={icon} size={26} color="#fff" />
//       <Text style={styles.navLabel}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F5F5F5" },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#146ED7",
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//   },
//    scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 70, // space for navbar height
//   },
//   headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },

//   topSection: {
//     alignItems: "center",
//     paddingVertical: 25,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   avatarCircle: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: "#A78BFA",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   avatarText: { color: "#fff", fontSize: 40, fontWeight: "bold" },
//   name: { fontSize: 22, fontWeight: "bold", color: "#222" },
//   subtitle: { fontSize: 15, color: "#555", marginTop: 4 },

//   detailsSection: {
//     backgroundColor: "#fff",
//     marginTop: 15,
//     padding: 20,
//   },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: 18,
//   },
//   infoLabel: { fontSize: 13, color: "#777" },
//   infoValue: { fontSize: 16, fontWeight: "500", color: "#222" },

  
// });







import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function FacultyProfile() {
  const router = useRouter();

  const openLinkedIn = () => {
    Linking.openURL("https://www.linkedin.com/in/admin-linkedin"); // Replace with actual
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={["#146ED7", "#4A90E2"]} style={styles.header}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Shravan Devrukhkar</Text>
        
      </LinearGradient>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>Name: Shravan Devkhkar</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>Email: faculty@uniflowcs.com</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>Education: M.Tech Computer Science</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color="#146ED7" />
          <Text style={styles.infoText}>Phone: +91 98765 43210</Text>
        </View>
        {/* LinkedIn */}
        <TouchableOpacity style={styles.infoRow} onPress={openLinkedIn}>
          <FontAwesome name="linkedin-square" size={22} color="#0A66C2" />
          <Text
            style={[styles.infoText, { color: "#0A66C2", textDecorationLine: "underline" }]}
          >
            linkedin.com/in/faculty-profile
          </Text>
        </TouchableOpacity>
      </View>

     

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/")}
      >
        <LinearGradient
          colors={["#E63946", "#FF6B6B"]}
          style={styles.logoutGradient}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },

  // Header
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#e6e6e6", marginTop: 4 },

  // Info Card
  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    marginBottom: 15,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  infoText: { fontSize: 16, marginLeft: 10, color: "#333" },

  
  // Logout Button
  logoutButton: { alignItems: "center" },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 8 },
});









