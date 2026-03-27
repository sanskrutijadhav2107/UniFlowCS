// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useRouter } from "expo-router";
// import AdminNavbar from "./components/AdminNavbar";

// export default function AdminUploadNotes() {
//   const router = useRouter();


//   // Subjects list
//   const subjects = ["DCN", "PP", "OOP", "DT"];

//   // Track currently selected subject
//   const [selectedSubject, setSelectedSubject] = useState(null);

//   // Track units state for each subject (lock/unlock)
//   const [subjectUnits, setSubjectUnits] = useState({
//     DCN: Array(6).fill("Locked"),
//     PP: Array(6).fill("Locked"),
//     OOP: Array(6).fill("Locked"),
//     DT: Array(6).fill("Locked"),
//   });

//   // Toggle lock/unlock for a unit
//   const toggleUnit = (subject, index) => {
//     setSubjectUnits((prev) => {
//       const updated = { ...prev };
//       updated[subject][index] =
//         updated[subject][index] === "Locked" ? "Unlocked" : "Locked";
//       return updated;
//     });
//   };

//   return (
//     <View style={styles.container}>
//        {/* Page Title */}
//           <View style={styles.header}>
//           <Text style={styles.pageTitle}>Upload Notes</Text>
//           <Text style={styles.subTitle}>Welcome</Text>
//           </View>

//       {/* Show Subjects if none selected */}
//       {!selectedSubject ? (
//         <ScrollView contentContainerStyle={styles.subjectList}>
//           {subjects.map((sub) => (
//             <TouchableOpacity
//               key={sub}
//               style={styles.subjectCard}
//               onPress={() => setSelectedSubject(sub)}
//             >
//               <Text style={styles.subjectCardText}>{sub}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       ) : (
//         // Show Units for selected subject
//         <ScrollView contentContainerStyle={styles.unitsContainer}>
//           {subjectUnits[selectedSubject].map((status, idx) => (
//             <TouchableOpacity
//               key={idx}
//               style={styles.unitRow}
//               onPress={() => toggleUnit(selectedSubject, idx)}
//             >
//               <Text style={styles.unitText}>Unit {idx + 1}</Text>
//               <View
//                 style={[
//                   styles.unitStatus,
//                   status === "Unlocked" ? styles.unlocked : styles.locked,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.statusText,
//                     status === "Unlocked" ? styles.unlockedText : styles.lockedText,
//                   ]}
//                 >
//                   {status}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
        
//       )}

//         {/* Bottom Navbar */}
//           <AdminNavbar />
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F5F5F5" },
//    // Header
//   header: {
//     paddingTop: 30,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     backgroundColor: "#E3F0FF",
//     borderBottomLeftRadius: 18,
//     borderBottomRightRadius: 18,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 6,
    
//   },
//   pageTitle: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#146ED7",
//   },
//   subTitle: {
//     fontSize: 14,
//     color: "#146ED7",
//     marginTop: 4,
//   },
//   // Subject Cards
//   subjectList: {
//     padding: 15,
//     paddingBottom: 80,
//   },
//   subjectCard: {
//     backgroundColor: "#146ED7",
//     borderRadius: 12,
//     paddingVertical: 30,
//     alignItems: "center",
//     marginBottom: 15,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 4,
//   },
//   subjectCardText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#fff",
//   },

//   // Units Section
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
//   },
//   unitText: { fontSize: 16, fontWeight: "bold", color: "#333" },
//   unitStatus: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
//   unlocked: { backgroundColor: "#D4F5E4" },
//   locked: { backgroundColor: "#FADAD8" },
//   statusText: { fontWeight: "bold", fontSize: 12 },
//   unlockedText: { color: "#28A745" },
//   lockedText: { color: "#DC3545" },

  
// });












import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AdminNavbar from "./components/AdminNavbar";

const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  success: "#10B981",
  danger: "#EF4444",
  accent: "#E0E7FF",
};

export default function AdminUploadNotes() {
  const router = useRouter();

  const subjects = [
    { name: "DCN", icon: "lan" },
    { name: "PP", icon: "code-braces" },
    { name: "OOP", icon: "cube-outline" },
    { name: "DT", icon: "pencil-ruler" }
  ];

  const [selectedSubject, setSelectedSubject] = useState(null);

  const [subjectUnits, setSubjectUnits] = useState({
    DCN: Array(6).fill("Locked"),
    PP: Array(6).fill("Locked"),
    OOP: Array(6).fill("Locked"),
    DT: Array(6).fill("Locked"),
  });

  const toggleUnit = (subject, index) => {
    setSubjectUnits((prev) => {
      const updated = { ...prev };
      updated[subject][index] =
        updated[subject][index] === "Locked" ? "Unlocked" : "Locked";
      return updated;
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* BRANDED HEADER */}
      <LinearGradient 
        colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View style={styles.headerTextWrapper}>
              {selectedSubject && (
                <TouchableOpacity onPress={() => setSelectedSubject(null)} style={styles.backBtn}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              )}
              <View>
                <Text style={styles.headerTitle}>
                  {selectedSubject ? `${selectedSubject} Units` : "Upload Notes"}
                </Text>
                <Text style={styles.headerSub}>
                  {selectedSubject ? "Manage content visibility" : "Select a subject to manage units"}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="file-upload-outline" size={28} color="white" />
          </View>
        </SafeAreaView>
      </LinearGradient>

      {!selectedSubject ? (
        <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
          {subjects.map((sub) => (
            <TouchableOpacity
              key={sub.name}
              activeOpacity={0.8}
              style={styles.subjectCard}
              onPress={() => setSelectedSubject(sub.name)}
            >
              <LinearGradient colors={['#FFFFFF', '#F8FAFF']} style={styles.cardGradient}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name={sub.icon} size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.subjectNameText}>{sub.name}</Text>
                <Text style={styles.subjectMetaText}>6 Units Total</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.unitsList} showsVerticalScrollIndicator={false}>
          {subjectUnits[selectedSubject].map((status, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              style={[styles.unitRow, status === "Unlocked" ? styles.rowUnlocked : styles.rowLocked]}
              onPress={() => toggleUnit(selectedSubject, idx)}
            >
              <View style={styles.unitInfo}>
                <View style={[styles.unitNumberCircle, { backgroundColor: status === "Unlocked" ? COLORS.success : COLORS.danger }]}>
                  <Text style={styles.unitNumberText}>{idx + 1}</Text>
                </View>
                <View>
                  <Text style={styles.unitTitleText}>Unit {idx + 1} Syllabus</Text>
                  <Text style={styles.unitSubText}>Tap to {status === "Locked" ? "Unlock" : "Lock"} access</Text>
                </View>
              </View>

              <View style={[styles.statusBadge, status === "Unlocked" ? styles.unlockedBadge : styles.lockedBadge]}>
                <MaterialCommunityIcons 
                  name={status === "Unlocked" ? "lock-open-outline" : "lock-outline"} 
                  size={16} 
                  color={status === "Unlocked" ? COLORS.success : COLORS.danger} 
                />
                <Text style={[styles.statusText, status === "Unlocked" ? styles.textUnlocked : styles.textLocked]}>
                  {status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <AdminNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTextWrapper: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 15, padding: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10 },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#fff" },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: "600" },

  // Grid Style
  gridContainer: { padding: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 120 },
  subjectCard: {
    width: '47%',
    aspectRatio: 1,
    marginBottom: 20,
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden'
  },
  cardGradient: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 15 },
  iconCircle: { width: 60, height: 60, borderRadius: 20, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  subjectNameText: { fontSize: 18, fontWeight: '900', color: COLORS.textMain },
  subjectMetaText: { fontSize: 12, color: COLORS.textSub, fontWeight: '600', marginTop: 4 },

  // Units List
  unitsList: { padding: 20, paddingBottom: 120 },
  unitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  rowUnlocked: { borderColor: 'rgba(16, 185, 129, 0.2)' },
  rowLocked: { borderColor: 'rgba(239, 68, 68, 0.1)' },
  unitInfo: { flexDirection: 'row', alignItems: 'center' },
  unitNumberCircle: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  unitNumberText: { color: 'white', fontWeight: '900', fontSize: 16 },
  unitTitleText: { fontSize: 16, fontWeight: '800', color: COLORS.textMain },
  unitSubText: { fontSize: 12, color: COLORS.textSub, fontWeight: '600' },

  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 5 },
  unlockedBadge: { backgroundColor: '#ECFDF5' },
  lockedBadge: { backgroundColor: '#FEF2F2' },
  statusText: { fontWeight: '800', fontSize: 11, textTransform: 'uppercase' },
  textUnlocked: { color: COLORS.success },
  textLocked: { color: COLORS.danger }
});
