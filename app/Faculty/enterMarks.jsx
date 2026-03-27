// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import {
//   collection,
//   onSnapshot,
//   query,
//   where,
//   getDocs,
//   doc,
//   setDoc,
// } from "firebase/firestore";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { db } from "../../firebase";

// export default function EnterMarks() {
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState(null);

//   const [students, setStudents] = useState([]);
//   const [marksMap, setMarksMap] = useState({});
//   const [loadingStudents, setLoadingStudents] = useState(false);
//   const [facultyId, setFacultyId] = useState(null);
//   const [savedMap, setSavedMap] = useState({});
 

// useEffect(() => {
//   const loadFaculty = async () => {
//     const data = await AsyncStorage.getItem("faculty");

//     if (data) {
//       const parsed = JSON.parse(data);

//       // adjust if needed (important)
//       setFacultyId(parsed.id || parsed.uid || parsed.facultyId || parsed.phone);
//     }
//   };

//   loadFaculty();
// }, []);

// useEffect(() => {
//   if (!facultyId) return;

//   const loadAssignedSubjects = async () => {
//     try {
//       // 1️⃣ Get assignments for this faculty
//       const q = query(
//         collection(db, "facultyAssignments"),
//         where("facultyId", "==", facultyId)
//       );

//       const snap = await getDocs(q);

//       const assignedSubjectIds = snap.docs.map((d) => d.data().subjectId);

//       if (assignedSubjectIds.length === 0) {
//         setSubjects([]);
//         return;
//       }

//       // 2️⃣ Get subjects matching those IDs
//       const subjectsSnap = await getDocs(collection(db, "subjects"));

//       const filtered = subjectsSnap.docs
//         .map((d) => ({ id: d.id, ...d.data() }))
//         .filter((sub) => assignedSubjectIds.includes(sub.code));

//       setSubjects(filtered);
//     } catch (e) {
//       console.log("Subject load error:", e);
//     }
//   };

//   loadAssignedSubjects();
// }, [facultyId]);

//   // 🔹 When subject selected → load students + existing marks
//   useEffect(() => {
//     if (!selectedSubject) return;

//     const loadStudentsAndMarks = async () => {
//       setLoadingStudents(true);

//       // 1️⃣ Get students of that semester
//       const sq = query(
//         collection(db, "students"),
//         where("semester", "==", selectedSubject.semester)
//       );
//       const studentSnap = await getDocs(sq);
//       const studentList = studentSnap.docs.map((d) => d.data());

//       // 2️⃣ Get all marks of this subject at once
//       const mq = query(
//         collection(db, "marks"),
//         where("subjectCode", "==", selectedSubject.code)
//       );
//       const marksSnap = await getDocs(mq);

//       const existingMarks = {};
//         const savedStatus = {};

//         marksSnap.forEach((doc) => {
//           const data = doc.data();
//           existingMarks[data.studentId] = data.marks.toString();
//           savedStatus[data.studentId] = true; // ✅ mark as saved
//         });

//       // 3️⃣ Prepare map
//       const initialMap = {};
//       studentList.forEach((s) => {
//         initialMap[s.prn] = existingMarks[s.prn] || "";
//       });

//       setStudents(studentList);
//       setMarksMap(initialMap);
//       setSavedMap(savedStatus); // ✅ add this
//       setLoadingStudents(false);
//     };

//     loadStudentsAndMarks();
//   }, [selectedSubject]);

//   // 🔹 Save (overwrite, never duplicate)
//   const submitMarks = async (student) => {
//     const mark = marksMap[student.prn];
//     if (mark === "") {
//       Alert.alert("Enter marks first");
//       return;
//     }

//     const docId = `${student.prn}_${selectedSubject.code}`;

//     await setDoc(doc(db, "marks", docId), {
//       studentId: student.prn,
//       studentName: student.name,
//       subjectCode: selectedSubject.code,
//       subjectName: selectedSubject.name,
//       semester: selectedSubject.semester,
//       credits: selectedSubject.credits,
//       marks: Number(mark),
//       updatedAt: new Date(),
//     });

//     setSavedMap((prev) => ({
//       ...prev,
//       [student.prn]: true,
//     }));
//     Alert.alert(`Saved for ${student.name}`);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>🧑‍🏫 Enter Marks</Text>

//       {/* Subjects */}
//       <FlatList
//         data={subjects}
//         horizontal
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={[
//               styles.subjectCard,
//               selectedSubject?.id === item.id && styles.selectedCard,
//             ]}
//             onPress={() => setSelectedSubject(item)}
//           >
//             <Text style={styles.subjectText}>{item.name}</Text>
//             <Text style={styles.creditText}>
//               Sem {item.semester} • {item.credits} credits
//             </Text>
//           </TouchableOpacity>
//         )}
//       />

//       {selectedSubject && (
//         <>
//           <Text style={styles.subheading}>
//             Students — Semester {selectedSubject.semester}
//           </Text>

//           {loadingStudents ? (
//             <ActivityIndicator size="large" />
//           ) : (
//             <FlatList
//               data={students}
//               keyExtractor={(item) => item.prn}
//               renderItem={({ item }) => (
                
//                 <View style={styles.row}>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.name}>{item.name}</Text>
//                     <Text style={styles.prn}>{item.prn}</Text>
//                   </View>

//                   <TextInput
//                     style={styles.input}
//                     placeholder="Marks"
//                     keyboardType="numeric"
//                     value={marksMap[item.prn]}
//                     onChangeText={(t) => {
//                       const clean = t.replace(/[^0-9]/g, "");

//                       setMarksMap({
//                         ...marksMap,
//                         [item.prn]: clean,
//                       });
                    
//                       // 🔄 mark as unsaved if edited
//                       setSavedMap({
//                         ...savedMap,
//                         [item.prn]: false,
//                       });
//                     }}
//                   />

//                   <TouchableOpacity
//                     style={[
//                       styles.saveBtn,
//                       savedMap[item.prn] && styles.savedBtn,
//                     ]}
//                     onPress={() => submitMarks(item)}
//                     disabled={savedMap[item.prn]}
//                   >
//                     <Text style={{ color: "#fff" }}>
//                       {savedMap[item.prn] ? "Saved" : "Save"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             />
//           )}
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "#F9FBFF" },
//   header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
//   subjectCard: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 10,
//     marginRight: 10,
//     width: 170,
//     elevation: 3,
//   },
//   selectedCard: { borderWidth: 2, borderColor: "#146ED7" },
//   subjectText: { fontWeight: "bold" },
//   creditText: { fontSize: 12, color: "#555", marginTop: 4 },
//   subheading: { marginVertical: 15, fontWeight: "600" },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 10,
//   },
//   name: { fontWeight: "bold" },
//   prn: { fontSize: 12, color: "#666" },
//   input: {
//     backgroundColor: "#E6F0FF",
//     borderRadius: 8,
//     padding: 8,
//     width: 70,
//     marginHorizontal: 8,
//     textAlign: "center",
//   },
//   saveBtn: {
//     backgroundColor: "#146ED7",
//     padding: 8,
//     borderRadius: 8,
//   },
//   savedBtn: {
//     backgroundColor: "#999",
//   },
// });













import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";

const COLORS = {
  primary: "#2D6EEF",
  secondary: "#1A50C8",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  success: "#10B981",
  accent: "#E0E7FF",
  border: "#E2E8F0"
};

export default function EnterMarks() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [marksMap, setMarksMap] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [facultyId, setFacultyId] = useState(null);
  const [savedMap, setSavedMap] = useState({});

  // --- LOGIC (RETAINED) ---
  useEffect(() => {
    const loadFaculty = async () => {
      const data = await AsyncStorage.getItem("faculty");
      if (data) {
        const parsed = JSON.parse(data);
        setFacultyId(parsed.id || parsed.uid || parsed.facultyId || parsed.phone);
      }
    };
    loadFaculty();
  }, []);

  useEffect(() => {
    if (!facultyId) return;
    const loadAssignedSubjects = async () => {
      try {
        const q = query(collection(db, "facultyAssignments"), where("facultyId", "==", facultyId));
        const snap = await getDocs(q);
        const assignedSubjectIds = snap.docs.map((d) => d.data().subjectId);
        if (assignedSubjectIds.length === 0) {
          setSubjects([]);
          return;
        }
        const subjectsSnap = await getDocs(collection(db, "subjects"));
        const filtered = subjectsSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((sub) => assignedSubjectIds.includes(sub.code));
        setSubjects(filtered);
      } catch (e) { console.log(e); }
    };
    loadAssignedSubjects();
  }, [facultyId]);

  useEffect(() => {
    if (!selectedSubject) return;
    const loadStudentsAndMarks = async () => {
      setLoadingStudents(true);
      const sq = query(collection(db, "students"), where("semester", "==", selectedSubject.semester));
      const studentSnap = await getDocs(sq);
      const studentList = studentSnap.docs.map((d) => d.data());
      const mq = query(collection(db, "marks"), where("subjectCode", "==", selectedSubject.code));
      const marksSnap = await getDocs(mq);
      const existingMarks = {};
      const savedStatus = {};
      marksSnap.forEach((doc) => {
        const data = doc.data();
        existingMarks[data.studentId] = data.marks.toString();
        savedStatus[data.studentId] = true;
      });
      const initialMap = {};
      studentList.forEach((s) => {
        initialMap[s.prn] = existingMarks[s.prn] || "";
      });
      setStudents(studentList);
      setMarksMap(initialMap);
      setSavedMap(savedStatus);
      setLoadingStudents(false);
    };
    loadStudentsAndMarks();
  }, [selectedSubject]);

  const submitMarks = async (student) => {
    const mark = marksMap[student.prn];
    if (mark === "") {
      Alert.alert("Input Required", "Please enter marks before saving.");
      return;
    }
    const docId = `${student.prn}_${selectedSubject.code}`;
    await setDoc(doc(db, "marks", docId), {
      studentId: student.prn,
      studentName: student.name,
      subjectCode: selectedSubject.code,
      subjectName: selectedSubject.name,
      semester: selectedSubject.semester,
      credits: selectedSubject.credits,
      marks: Number(mark),
      updatedAt: new Date(),
    });
    setSavedMap((prev) => ({ ...prev, [student.prn]: true }));
  };
  // --- END LOGIC ---

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <LinearGradient colors={[COLORS.secondary, COLORS.primary]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setSelectedSubject(null)}>
            <Ionicons name="school" size={28} color="white" />
          </TouchableOpacity>
          <View style={{marginLeft: 15}}>
            <Text style={styles.headerTitle}>Marks Entry</Text>
            <Text style={styles.headerSub}>Academic Session 2025-26</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.mainContent}>
        <Text style={styles.label}>Your Assigned Subjects</Text>
        <FlatList
          data={subjects}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          style={styles.subjectList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.subjectBtn, selectedSubject?.id === item.id && styles.subjectBtnActive]}
              onPress={() => setSelectedSubject(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.subjectBtnText, selectedSubject?.id === item.id && styles.whiteText]}>
                {item.name}
              </Text>
              <Text style={[styles.subjectBtnSub, selectedSubject?.id === item.id && styles.whiteText]}>
                Code: {item.code}
              </Text>
            </TouchableOpacity>
          )}
        />

        {selectedSubject ? (
          <View style={{ flex: 1 }}>
            <View style={styles.listHeader}>
              <Text style={styles.label}>Students ({students.length})</Text>
              <View style={styles.semBadge}>
                <Text style={styles.semBadgeText}>Semester {selectedSubject.semester}</Text>
              </View>
            </View>

            {loadingStudents ? (
              <View style={styles.loaderBox}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loaderText}>Loading Class List...</Text>
              </View>
            ) : (
              <FlatList
                data={students}
                keyExtractor={(item) => item.prn}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                renderItem={({ item }) => (
                  <View style={[styles.studentCard, savedMap[item.prn] && styles.cardSaved]}>
                    <View style={styles.studentInfo}>
                      <Text style={styles.sName}>{item.name}</Text>
                      <Text style={styles.sPrn}>PRN: {item.prn}</Text>
                    </View>

                    <View style={styles.actionArea}>
                      <TextInput
                        style={[styles.markInput, savedMap[item.prn] && styles.inputSaved]}
                        placeholder="--"
                        keyboardType="numeric"
                        maxLength={3}
                        value={marksMap[item.prn]}
                        onChangeText={(t) => {
                          const clean = t.replace(/[^0-9]/g, "");
                          setMarksMap({ ...marksMap, [item.prn]: clean });
                          setSavedMap({ ...savedMap, [item.prn]: false });
                        }}
                      />
                      <TouchableOpacity
                        style={[styles.circleBtn, savedMap[item.prn] ? styles.circleBtnSaved : styles.circleBtnActive]}
                        onPress={() => submitMarks(item)}
                        disabled={savedMap[item.prn]}
                      >
                        <Feather 
                          name={savedMap[item.prn] ? "check" : "arrow-up"} 
                          size={18} 
                          color="white" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        ) : (
          <View style={styles.emptyView}>
            <MaterialCommunityIcons name="book-multiple" size={60} color="#CBD5E1" />
            <Text style={styles.emptyText}>Please select a subject to start grading</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "white" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: "600" },

  mainContent: { flex: 1, padding: 20 },
  label: { fontSize: 12, fontWeight: "800", color: COLORS.textSub, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  
  subjectList: { marginBottom: 20, maxHeight: 75 },
  subjectBtn: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center'
  },
  subjectBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, elevation: 4 },
  subjectBtnText: { fontSize: 14, fontWeight: "800", color: COLORS.textMain },
  subjectBtnSub: { fontSize: 10, color: COLORS.textSub, marginTop: 2 },
  whiteText: { color: "white" },

  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  semBadge: { backgroundColor: COLORS.accent, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  semBadgeText: { fontSize: 11, color: COLORS.primary, fontWeight: '800' },

  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardSaved: { borderColor: COLORS.success, backgroundColor: '#F0FDF4' },
  studentInfo: { flex: 1 },
  sName: { fontSize: 15, fontWeight: '800', color: COLORS.textMain },
  sPrn: { fontSize: 12, color: COLORS.textSub, fontWeight: '600', marginTop: 2 },

  actionArea: { flexDirection: 'row', alignItems: 'center' },
  markInput: {
    width: 50,
    height: 45,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  inputSaved: { color: COLORS.success, backgroundColor: 'white' },
  circleBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  circleBtnActive: { backgroundColor: COLORS.primary },
  circleBtnSaved: { backgroundColor: COLORS.success },

  loaderBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 10, color: COLORS.textSub, fontWeight: '700' },
  emptyView: { flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.5 },
  emptyText: { marginTop: 15, color: COLORS.textSub, fontWeight: '600', textAlign: 'center', width: '60%' }
});