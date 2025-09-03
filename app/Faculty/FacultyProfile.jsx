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
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import BottomNavbar from "./Components/BottomNavbar"; 

export default function Profile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Uniflow-CS</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Top Section */}
        <View style={styles.topSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <Text style={styles.name}>Satish Nannavare</Text>
          <Text style={styles.subtitle}>Assistant Professor</Text>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsSection}>
          <ProfileRow icon="school-outline" label="Education" value="M.Tech Computer Science" />
          <ProfileRow icon="book-outline" label="Subject" value="HTML, OOP, Microprocessor" />
          <ProfileRow icon="call-outline" label="Phone" value="+91 234 567 890" />
          <ProfileRow icon="mail-outline" label="Email" value="satish@example.com" />
        </View>
      </ScrollView>

      {/* ✅ Navbar always at bottom */}
      <BottomNavbar />
    </View>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color="#146ED7" />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 70, // space for navbar height
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#146ED7",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  topSection: {
    alignItems: "center",
    paddingVertical: 25,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#A78BFA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: { color: "#fff", fontSize: 40, fontWeight: "bold" },
  name: { fontSize: 22, fontWeight: "bold", color: "#222" },
  subtitle: { fontSize: 15, color: "#555", marginTop: 4 },

  detailsSection: {
    backgroundColor: "#fff",
    marginTop: 15,
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  infoLabel: { fontSize: 13, color: "#777" },
  infoValue: { fontSize: 16, fontWeight: "500", color: "#222" },
});
