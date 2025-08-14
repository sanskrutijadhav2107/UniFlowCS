// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";

// export default function UploadNotes() {
//   const subjects = ["DCN", "PP", "OOP", "DT"];
//   const units = [
//     { id: 1, status: "Unlocked" },
//     { id: 2, status: "Locked" },
//     { id: 3, status: "Locked" },
//     { id: 4, status: "Locked" },
//     { id: 5, status: "Locked" },
//     { id: 6, status: "Locked" },
//   ];

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity>
//           <Ionicons name="arrow-back-outline" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Uniflow-CS</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Subjects */}
//       <View style={styles.subjectRow}>
//         {subjects.map((sub) => (
//           <View key={sub} style={styles.subjectCircle}>
//             <Text style={styles.subjectText}>{sub}</Text>
//           </View>
//         ))}
//       </View>

//       {/* Units */}
//       <ScrollView contentContainerStyle={styles.unitsContainer}>
//         {units.map((unit) => (
//           <View key={unit.id} style={styles.unitRow}>
//             <Text style={styles.unitText}>Unit {unit.id}</Text>
//             <View
//               style={[
//                 styles.unitStatus,
//                 unit.status === "Unlocked" ? styles.unlocked : styles.locked,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.statusText,
//                   unit.status === "Unlocked" ? styles.unlockedText : styles.lockedText,
//                 ]}
//               >
//                 {unit.status}
//               </Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Bottom Navigation */}
//       <View style={styles.bottomNav}>
//         <NavIcon label="Notes" icon="create-outline" />
//         <NavIcon label="Timetable" icon="grid-outline" />
//         <NavIcon label="Post" icon="add-circle-outline" />
//         <NavIcon label="Notice" icon="document-text-outline" />
//         <NavIcon label="You" icon="person-circle-outline" />
//       </View>
//     </View>
//   );
// }

// function NavIcon({ label, icon }) {
//   return (
//     <TouchableOpacity style={styles.navItem}>
//       <Ionicons name={icon} size={26} color="#146ED7" />
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
//   headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },

//   subjectRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginVertical: 15,
//   },
//   subjectCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#6ba3e9ff",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 3,
//   },
//   subjectText: { fontWeight: "bold", color: "#ffffffff" },

//   unitsContainer: { paddingHorizontal: 15, paddingBottom: 80 },
//   unitRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 3,
//     color:"#fff"
//   },
//   unitText: { fontSize: 16, fontWeight: "bold", color: "#333" },
//   unitStatus: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
//   unlocked: { backgroundColor: "#D4F5E4" },
//   locked: { backgroundColor: "#FADAD8" },
//   statusText: { fontWeight: "bold", fontSize: 12 },
//   unlockedText: { color: "#28A745" },
//   lockedText: { color: "#DC3545" },

//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     backgroundColor: "#2d6eefff",
//     marginHorizontal: 15,
//     marginBottom: 10,
//     paddingVertical: 10,
//     borderRadius: 30,
//   },
//   navItem: { alignItems: "center" },
//   navLabel: { fontSize: 12, color: "#ffffffff", marginTop: 2 },
// });


import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function UploadNotes() {
  const subjects = ["DCN", "PP", "OOP", "DT"];
  const units = [
    { id: 1, status: "Unlocked" },
    { id: 2, status: "Locked" },
    { id: 3, status: "Locked" },
    { id: 4, status: "Locked" },
    { id: 5, status: "Locked" },
    { id: 6, status: "Locked" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Uniflow-CS</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Subjects */}
      <View style={styles.subjectRow}>
        {subjects.map((sub) => (
          <View key={sub} style={styles.subjectCircle}>
            <Text style={styles.subjectText}>{sub}</Text>
          </View>
        ))}
      </View>

      {/* Units */}
      <ScrollView contentContainerStyle={styles.unitsContainer}>
        {units.map((unit) => (
          <View key={unit.id} style={styles.unitRow}>
            <Text style={styles.unitText}>Unit {unit.id}</Text>
            <View
              style={[
                styles.unitStatus,
                unit.status === "Unlocked" ? styles.unlocked : styles.locked,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  unit.status === "Unlocked" ? styles.unlockedText : styles.lockedText,
                ]}
              >
                {unit.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavIcon label="Home" icon="home-outline" />
          <NavIcon label="Upload Notes" icon="cloud-upload-outline" />
          <NavIcon label="Ranking" icon="trophy-outline" />
          <NavIcon label="TimeTable" icon="calendar-outline" />
          <NavIcon label="Profile" icon="person-outline" />
      </View>
    </View>
  );
}

function NavIcon({ label, icon }) {
  return (
    <TouchableOpacity style={styles.navItem}>
      <Ionicons name={icon} size={26} color="#fff" />
      <Text style={styles.navLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  subjectRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  subjectCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0056b3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  subjectText: { fontWeight: "bold", color: "#fff" },

  unitsContainer: { paddingHorizontal: 15, paddingBottom: 80 },
  unitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  unitText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  unitStatus: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  unlocked: { backgroundColor: "#D4F5E4" },
  locked: { backgroundColor: "#FADAD8" },
  statusText: { fontWeight: "bold", fontSize: 12 },
  unlockedText: { color: "#28A745" },
  lockedText: { color: "#DC3545" },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#007BFF", // Primary theme color
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#0056b3", // Darker border
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  navItem: { alignItems: "center" },
  navLabel: { fontSize: 12, color: "#fff", marginTop: 2 },
});

