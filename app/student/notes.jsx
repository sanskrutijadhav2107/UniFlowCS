
// // app/Student/StudentNotesPage.jsx
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Linking,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { db } from "../../firebase";

// const MAX_UNITS = 6; // adjust if your subjects have different unit counts

// export default function StudentNotesPage() {
//   const router = useRouter();
//   const [student, setStudent] = useState(null);
//   const [subjectsWithNotes, setSubjectsWithNotes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotesForStudent = async () => {
//       try {
//         setLoading(true);

//         // 1) Load student from AsyncStorage
//         const stored = await AsyncStorage.getItem("student");
//         if (!stored) {
//           Alert.alert("Not logged in", "Please log in to view notes.");
//           router.push("/Student/StudentLogin"); // adjust path to your login
//           return;
//         }

//         const studentData = JSON.parse(stored);

//         // Expect studentData.semester to exist
//         const semester = Number(studentData?.semester);
//         if (!semester || Number.isNaN(semester)) {
//           Alert.alert(
//             "Missing data",
//             "Your profile doesn't have a semester set. Please update your student profile."
//           );
//           router.push("/Student/StudentProfile"); // optional: redirect to profile edit
//           return;
//         }

//         setStudent(studentData);

//         // 2) Query subjects collection for this semester (match by doc id being subject code)
//         const subjQuery = query(
//           collection(db, "subjects"),
//           where("semester", "==", semester)
//         );
//         const subjSnap = await getDocs(subjQuery);

//         if (subjSnap.empty) {
//           setSubjectsWithNotes([]);
//           return;
//         }

//         const subjectsList = [];

//         // 3) For each subject doc fetch notes by subjectId (doc id) and only unlocked notes
//         for (const subjDoc of subjSnap.docs) {
//           const subject = { id: subjDoc.id, ...subjDoc.data() };

//           // query notes where subjectId == subjDoc.id and locked == false
//           const notesQuery = query(
//             collection(db, "notes"),
//             where("subjectId", "==", subjDoc.id),
//             where("locked", "==", false)
//           );

//           const notesSnap = await getDocs(notesQuery);

//           // fill unit slots
//           const unitNotes = Array(MAX_UNITS).fill(null);

//           notesSnap.docs.forEach((nDoc) => {
//             const n = nDoc.data();
//             // validate unit number
//             const u = Number(n.unit);
//             if (!Number.isNaN(u) && u >= 1 && u <= MAX_UNITS) {
//               unitNotes[u - 1] = { id: nDoc.id, ...n };
//             }
//           });

//           subject.notes = unitNotes;
//           subjectsList.push(subject);
//         }

//         setSubjectsWithNotes(subjectsList);
//       } catch (err) {
//         console.error("Error fetching notes:", err);
//         Alert.alert("Error", err.message || "Failed to load notes");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotesForStudent();
//   }, [router]);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#146ED7" />
//         <Text>Loading notes...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
//       <Text style={styles.header}>📚 Notes — Semester {student?.semester}</Text>

//       {subjectsWithNotes.length === 0 ? (
//         <Text style={styles.emptyText}>No subjects found for your semester.</Text>
//       ) : (
//         subjectsWithNotes.map((subj) => (
//           <View key={subj.id} style={styles.card}>
//             <Text style={styles.subjectTitle}>
//               {subj.name} <Text style={{ color: "#777" }}>({subj.id})</Text>
//             </Text>

//             {subj.notes.map((note, idx) => (
//               <View key={idx} style={styles.unitRow}>
//                 <Text style={styles.unitText}>Unit {idx + 1}</Text>

//                 {note ? (
//                   <TouchableOpacity
//                     onPress={() => {
//                       if (!note.fileUrl) {
//                         Alert.alert("File missing", "This note does not have a downloadable file.");
//                         return;
//                       }
//                       Linking.openURL(note.fileUrl).catch(() =>
//                         Alert.alert("Open failed", "Could not open the file URL.")
//                       );
//                     }}
//                     style={styles.openBtn}
//                   >
//                     <Text style={styles.openText}>Open</Text>
//                   </TouchableOpacity>
//                 ) : (
//                   <Text style={styles.lockedText}>Not available</Text>
//                 )}
//               </View>
//             ))}
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F5F5F5", padding: 10 },
//   header: { fontSize: 20, fontWeight: "bold", color: "#146ED7", marginBottom: 15, textAlign: "center" },
//   emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#555" },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     elevation: 3,
//   },
//   subjectTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#333" },
//   unitRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderColor: "#eee",
//   },
//   unitText: { fontSize: 15, color: "#333" },
//   openBtn: { backgroundColor: "#146ED7", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6 },
//   openText: { color: "#fff", fontWeight: "700" },
//   lockedText: { color: "#DC3545", fontWeight: "700" },
//   centered: { flex: 1, justifyContent: "center", alignItems: "center" },
// });


















import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MAX_UNITS = 6;

const COLORS = {
  // THE CAMPUS BUZZ PALETTE
  primaryDark: "#1A50C8", 
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  accent: "#22C55E", // Vibrant green for "Open"
  textMain: "#0F172A",
  textSub: "#64748B",
  error: "#EF4444"
};

export default function StudentNotesPage() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [subjectsWithNotes, setSubjectsWithNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotesForStudent = async () => {
      try {
        setLoading(true);
        const stored = await AsyncStorage.getItem("student");
        if (!stored) {
          Alert.alert("Not logged in", "Please log in.");
          router.push("/Student/StudentLogin");
          return;
        }
        const studentData = JSON.parse(stored);
        const semester = Number(studentData?.semester);
        if (!semester) {
          router.push("/Student/StudentProfile");
          return;
        }
        setStudent(studentData);

        const subjQuery = query(collection(db, "subjects"), where("semester", "==", semester));
        const subjSnap = await getDocs(subjQuery);
        if (subjSnap.empty) {
          setSubjectsWithNotes([]);
          return;
        }

        const subjectsList = [];
        for (const subjDoc of subjSnap.docs) {
          const subject = { id: subjDoc.id, ...subjDoc.data() };
          const notesQuery = query(
            collection(db, "notes"),
            where("subjectId", "==", subjDoc.id),
            where("locked", "==", false)
          );
          const notesSnap = await getDocs(notesQuery);
          const unitNotes = Array(MAX_UNITS).fill(null);
          notesSnap.docs.forEach((nDoc) => {
            const n = nDoc.data();
            const u = Number(n.unit);
            if (!Number.isNaN(u) && u >= 1 && u <= MAX_UNITS) {
              unitNotes[u - 1] = { id: nDoc.id, ...n };
            }
          });
          subject.notes = unitNotes;
          subjectsList.push(subject);
        }
        setSubjectsWithNotes(subjectsList);
      } catch (err) {
        Alert.alert("Error", "Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotesForStudent();
  }, [router]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* CAMPUS BUZZ VIBRANT HEADER */}
      <LinearGradient 
        colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
        style={styles.header}
      >
        <View style={styles.statusSpacer} />
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Study Material</Text>
            <Text style={styles.headerSub}>Semester {student?.semester} Resources</Text>
          </View>
          <MaterialCommunityIcons name="bookshelf" size={32} color="white" />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {subjectsWithNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No subjects available.</Text>
          </View>
        ) : (
          subjectsWithNotes.map((subj) => (
            <View key={subj.id} style={styles.subjectCard}>
              <View style={styles.cardHeader}>
                <View style={styles.indicator} />
                <View style={{flex: 1}}>
                  <Text style={styles.subjectName}>{subj.name}</Text>
                  <Text style={styles.subjectCode}>{subj.id}</Text>
                </View>
              </View>

              <View style={styles.unitGrid}>
                {subj.notes.map((note, idx) => (
                  <TouchableOpacity
                    key={idx}
                    disabled={!note}
                    onPress={() => {
                      if (note?.fileUrl) {
                        Linking.openURL(note.fileUrl).catch(() =>
                          Alert.alert("Error", "Could not open file.")
                        );
                      }
                    }}
                    style={[styles.unitButton, !note && styles.lockedButton]}
                  >
                    <Text style={[styles.unitNum, !note && {color: COLORS.textSub}]}>Unit {idx + 1}</Text>
                    <MaterialCommunityIcons 
                      name={note ? "file-pdf-box" : "lock"} 
                      size={20} 
                      color={note ? COLORS.error : "#CBD5E1"} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    height: 170,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    elevation: 8,
  },
  statusSpacer: { height: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 26, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' , marginBottom:10},
  
  scroll: { flex: 1, marginTop: -25 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  
  subjectCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  indicator: { width: 4, height: 30, backgroundColor: COLORS.primary, borderRadius: 2, marginRight: 12 },
  subjectName: { fontSize: 17, fontWeight: '800', color: COLORS.textMain },
  subjectCode: { fontSize: 11, color: COLORS.textSub, fontWeight: '700', textTransform: 'uppercase' },
  
  unitGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  unitButton: {
    width: (SCREEN_WIDTH - 84) / 3,
    backgroundColor: '#F1F6FF',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  lockedButton: { backgroundColor: '#F8FAFC', borderColor: '#F1F5F9', opacity: 0.7 },
  unitNum: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },

  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: COLORS.textSub, fontWeight: '600' },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
